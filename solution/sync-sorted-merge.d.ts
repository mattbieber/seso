declare namespace _exports {
    export { LogEntry, Pop, LogSource, Printer };
}
declare function _exports(logSources: Array<LogSource>, printer: Printer): void;
export = _exports;
type LogEntry = import('./pq.js').LogEntry;
type Pop = Function;
/**
 * LogSource
 */
type LogSource = {
    drained: boolean;
    pop: Pop;
};
/**
 * Printer
 */
type Printer = any;
//# sourceMappingURL=sync-sorted-merge.d.ts.map