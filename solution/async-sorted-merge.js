// @ts-check
'use strict'
const PQ = require('./pq')
// Your mission is to print out all of the entries, across all of the *async* sources, in chronological order.

/* TYPES */
/**
 * @typedef {import('./pq.js').LogEntry} LogEntry
 * @typedef {import('./sync-sorted-merge.js').Printer} Printer
 */

/**
 * @typedef {Function} PopAsync
 * @returns {Promise<LogEntry>}
 */

/**
 * LogSource
 * @typedef {Object} LogSource
 * @property {boolean} drained
 * @property {PopAsync} popAsync
 */

/**
 * @param {Array<LogSource>} logSources
 * @param {Printer} printer
 * @returns {Promise<Void>}
 */
module.exports = (logSources, printer) => {
    return new Promise((resolve, reject) => {
        /**
         * keep track of which log sources still have entries to pop - remove empty sources
         * and take from a different sourceId if any remaining
         * @type {Set<number>} logSourcesRemaining
         * */
        const logSourcesRemaining = new Set()
        const pq = new PQ()

        const MAX_LENGTH = 10000

        const sourceCount = logSources.length

        const getFromLogSource = (logSourceIndex) => {
            return new Promise((resolve, reject) => {
                /** @type {LogEntry | false} logEntry */
                logSources[logSourceIndex].popAsync().then((logEntry) => {
                    if (logEntry) {
                        logEntry.logSourceId = logSourceIndex
                        logSourcesRemaining.add(logSourceIndex)
                        pq.push(logEntry)
                    } else {
                        /**
                         * got false from pop() operation indicating source is drained
                         * try new source Id
                         */
                        console.log(`source drained: ${logSourceIndex}`)
                        logSourcesRemaining.delete(logSourceIndex)
                        if (logSourcesRemaining.size > 0) {
                            const logSourceId = logSourcesRemaining
                                .values()
                                .next().value

                            /** @type {LogEntry | false} newSourceEntry */
                            logSources[logSourceId]
                                .popAsync()
                                .then((newSourceEntry) => {
                                    if (newSourceEntry) {
                                        newSourceEntry.logSourceId = logSourceId
                                        pq.push(newSourceEntry)
                                    }
                                })
                        }
                    }
                    resolve()
                })
            })
        }

        const processLogs = () => {
            if (logSourcesRemaining.size === 0) {
                console.log('Async sort complete.')
                printer.done()
                return
            }

            const minLogEntry = pq.pop()
            printer.print(minLogEntry)
            let sourceId = minLogEntry.logSourceId

            if (pq.len < MAX_LENGTH) {
                const jobs = []
                logSourcesRemaining.forEach((n) => {
                    jobs.push(
                        new Promise((resolve, reject) => {
                            getFromLogSource(n).then(() => resolve())
                        }),
                    )
                })

                Promise.all(jobs).then(() => {
                    processLogs()
                })
            } else {
                /** @type {LogEntry | false } tryNewEntry */
                getFromLogSource(sourceId).then(() => {
                    processLogs()
                })
            }
        }
        /** start with adding log entries from all log sources concurrently */
        return Promise.all(logSources.map((_, i) => getFromLogSource(i))).then(
            () => {
                processLogs()
            },
        )
    })
}
