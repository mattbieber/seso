declare namespace _exports {
    export { LogEntry, Printer, PopAsync, LogSource };
}
declare function _exports(logSources: Array<LogSource>, printer: Printer): Promise<void>;
export = _exports;
type LogEntry = import('./pq.js').LogEntry;
type Printer = import('./sync-sorted-merge.js').Printer;
type PopAsync = Function;
/**
 * LogSource
 */
type LogSource = {
    drained: boolean;
    popAsync: PopAsync;
};
//# sourceMappingURL=async-sorted-merge.d.ts.map