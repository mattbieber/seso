export = PQ;
declare class PQ {
    /**  @type {LogEntryNode[]} items */
    items: LogEntryNode[];
    get len(): number;
    isEmpty(): boolean;
    /**
     *
     * @returns {LogEntry}
     */
    pop(): LogEntry;
    /**  @param {LogEntry} value */
    push(value: LogEntry): void;
    /**
     * @param {number} i
     * @returns {LogEntryNode | undefined}
     */
    parent(i: number): LogEntryNode | undefined;
    /**
     * @param {number} i
     * @returns {number}
     */
    parentIndex(i: number): number;
    /**
     * @param {number} i
     * @returns {number}
     */
    leftChildIndex(i: number): number;
    /**
     * @param {number} i
     * @returns {number}
     */
    rightChildIndex(i: number): number;
    /**
     * @param {number} i
     * @returns {boolean}
     */
    hasLeftChild(i: number): boolean;
    /**
     * @param {number} i
     * @returns {boolean}
     */
    hasRightChild(i: number): boolean;
    /**
     * @param {number} i
     * @returns {number}
     */
    getMinChildIndex(i: number): number;
    /**
     *
     * @param {number} i
     * @param {number} j
     * @returns {Void}
     */
    swap(i: number, j: number): void;
    orderUp(): void;
    orderDown(currentNodeIndex: any): void;
    heapify(): void;
}
declare namespace PQ {
    export { LogEntry };
}
/**
 * LogEntry
 * @typedef {Object} LogEntry
 * @property {Date} date
 * @property {string} msg
 * @property {number} logSourceId
 */
declare class LogEntryNode {
    /** @param {LogEntry} value */
    constructor(value: LogEntry);
    value: LogEntry;
    /** @param {number} priority */
    priority: number;
}
/**
 * LogEntry
 */
type LogEntry = {
    date: Date;
    msg: string;
    logSourceId: number;
};
//# sourceMappingURL=pq.d.ts.map