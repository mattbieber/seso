// @ts-check
'use strict'
const PQ = require('./pq')

// Your mission is to print out all of the entries, across all of the sources, in chronological order.

/* TYPES */
/**
 * @typedef {import('./pq.js').LogEntry} LogEntry
 */

/** 
 * @typedef {Function} Pop
 * @returns {LogEntry}
 */

/**
 * LogSource
 * @typedef {Object} LogSource
 * @property {boolean} drained
 * @property {Pop} pop
 */

/**
 * Printer
 * @typedef {Object} Printer
 * @method {Void} print
 * @method {Void} done
 */

/**
 * @param {Array<LogSource>} logSources 
 * @param {Printer} printer 
 * @returns {Void}
 */
module.exports = (logSources, printer) => {
    const pq = new PQ()
    
    /**
     * keep track of which log sources still have entries to pop - remove empty sources
     * and take from a different sourceId if any remaining
     * @type {Set<number>} logSourcesRemaining 
     * */
    const logSourcesRemaining = new Set()

    for (const [logSourceIndex, logSource] of logSources.entries()) {
        
        /** @type {LogEntry} logEntry */
        var logEntry = logSource.pop()

        /** tag the entry with the logSourceIndex so we can track exhausted sources */
        logEntry.logSourceId = logSourceIndex
        logSourcesRemaining.add(logEntry.logSourceId)
        pq.push(logEntry)
    }
   
    let minLogEntry
    while (minLogEntry = pq.pop()) {
        printer.print(minLogEntry)
        let sourceId = minLogEntry.logSourceId
       
        /** @type {LogEntry | false } logEntry */
        const tryNewEntry = logSources[sourceId].pop()
        
        if(tryNewEntry) {
            tryNewEntry.logSourceId = sourceId
            pq.push(tryNewEntry)
        } else {
            /** 
             * got false from pop() operation indicating source is drained 
             * try new source Id
             */
            logSourcesRemaining.delete(sourceId)
            sourceId = logSourcesRemaining.values().next().value
            
            if(logSourcesRemaining.size === 0) continue

            /** @type {LogEntry | false} logEntry */
            const newSourceEntry = logSources[sourceId].pop()

            if(newSourceEntry) {
                newSourceEntry.logSourceId = sourceId
                pq.push(newSourceEntry)
            }
        }
    }
 
    printer.done()
    console.log('Sync sort complete.')
}
