// @ts-check

/**
 * LogEntry
 * @typedef {Object} LogEntry
 * @property {Date} date
 * @property {string} msg
 * @property {number} logSourceId
 */

class LogEntryNode {
    /** @param {LogEntry} value */
    constructor(value) {
        this.value = value
        /** @param {number} priority */
        this.priority = value.date.getTime()
    }
}

module.exports = class PQ {
    constructor(maxSize = 10000) {
        /**  @type {LogEntryNode[]} items */
        this.items = []
        this.maxSize = maxSize
    }

    get len() {
        return this.items.length
    }

    isEmpty() {
        return this.items.length === 0
    }

    /**
     *
     * @returns {LogEntry}
     */
    pop() {
        if (this.len === 0) {
            return null
        }

        if (this.len === 1) {
            const node = this.items.pop()
            return node.value
        }

        const node = this.items[0]
        this.items[0] = this.items.pop()
        this.orderDown(0)

        return node.value
    }

    /**  @param {LogEntry} value */
    push(value) {
        const nodeEntry = new LogEntryNode(value)
        
        this.items.push(nodeEntry)
        this.orderUp()
    }

    /**
     * @param {number} i
     * @returns {LogEntryNode | undefined}
     */
    parent(i) {
        return i < this.len && this.parentIndex(i) >= 0
            ? this.items[this.parentIndex(i)]
            : undefined
    }

    /**
     * @param {number} i
     * @returns {number}
     */
    parentIndex(i) {
        return Math.floor((i + 1) / 2) - 1
    }

    /**
     * @param {number} i
     * @returns {number}
     */
    leftChildIndex(i) {
        return 2 * i + 1
    }

    /**
     * @param {number} i
     * @returns {number}
     */
    rightChildIndex(i) {
        return 2 * i + 2
    }

    /**
     * @param {number} i
     * @returns {boolean}
     */
    hasLeftChild(i) {
        return this.leftChildIndex(i) < this.len
    }

    /**
     * @param {number} i
     * @returns {boolean}
     */
    hasRightChild(i) {
        return this.rightChildIndex(i) < this.len
    }

    /**
     * @param {number} i
     * @returns {number}
     */
    getMinChildIndex(i) {
        if (this.hasRightChild(i)) {
            const leftChildIndex = this.leftChildIndex(i)
            const rightChildIndex = this.rightChildIndex(i)

            const leftChild = this.items[leftChildIndex]
            const rightChild = this.items[rightChildIndex]

            if (leftChild.priority < rightChild.priority) {
                return leftChildIndex
            }
            return rightChildIndex
        } else if (this.hasLeftChild(i)) {
            return this.leftChildIndex(i)
        } else {
            return null
        }
    }

    /**
     *
     * @param {number} i
     * @param {number} j
     * @returns {Void}
     */
    swap(i, j) {
        ;[this.items[i], this.items[j]] = [this.items[j], this.items[i]]
    }

    orderUp() {
        let currentNodeIndex = this.items.length - 1
        let parentNodeIndex = this.parentIndex(currentNodeIndex)

        while (
            parentNodeIndex >= 0 &&
            this.items[currentNodeIndex].priority <
                this.items[parentNodeIndex].priority
        ) {
            this.swap(currentNodeIndex, parentNodeIndex)
            currentNodeIndex = parentNodeIndex
            parentNodeIndex = this.parentIndex(currentNodeIndex)
        }
    }

    
    orderDown(i) {
       
        let currentNodeIndex = i
        let childIndex = this.getMinChildIndex(currentNodeIndex)

        while (
            this.items[childIndex] &&
            this.items[currentNodeIndex].priority >=
                this.items[childIndex].priority
        ) {
            this.swap(currentNodeIndex, childIndex)
            currentNodeIndex = childIndex
            childIndex = this.getMinChildIndex(currentNodeIndex)
        }
    }

    heapify() {
        let lastWithChildren = Math.floor(this.items.length / 2)
        while(lastWithChildren >= 0) {
            this.orderDown(lastWithChildren)
            lastWithChildren--
        }
    }
 

}
