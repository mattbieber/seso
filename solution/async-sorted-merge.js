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

        const processLogs = async () => {
            let minLogEntry
            while ((minLogEntry = pq.pop())) {
                printer.print(minLogEntry)
                let sourceId = minLogEntry.logSourceId

                /** @type {LogEntry | false } tryNewEntry */
                const tryNewEntry = await logSources[sourceId].popAsync()
                
                if (tryNewEntry) {
                    tryNewEntry.logSourceId = sourceId
                    pq.push(tryNewEntry)
                } 
                else {
                    /**
                     * got false from pop() operation indicating source is drained
                     * try new source Id
                     */
                    logSourcesRemaining.delete(sourceId)
                    if (logSourcesRemaining.size === 0) return

                    const logSourceId = logSourcesRemaining
                        .values()
                        .next().value

                    /** @type {LogEntry | false} logEntry */
                    const newSourceEntry =
                        await logSources[logSourceId].popAsync()

                    if (newSourceEntry) {
                        newSourceEntry.logSourceId = logSourceId
                        pq.push(newSourceEntry)
                    }
                }
            }
        }
        
        const addInitialEntries = async (logSourceIndex) => {
            try {
                /** @type {LogEntry | false} logEntry */
                const logEntry = await logSources[logSourceIndex].popAsync()

                if (logEntry) {
                    /** tag the entry with the logSourceIndex so we can track exhausted sources */
                    logEntry.logSourceId = logSourceIndex
                    logSourcesRemaining.add(logEntry.logSourceId)
                    pq.push(logEntry)
                } 
            } catch (err) {
                console.error(err)
            }

            if (pq.len === logSources.length) {
                await processLogs()
                console.log('Async sort complete.')
                printer.done()
                return
            }
        }

        for (const [logSourceIndex, logSource] of logSources.entries()) {
            addInitialEntries(logSourceIndex)
        }

    })
}
