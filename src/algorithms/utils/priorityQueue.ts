/**
 * naive implementation of a priority queue by using a list sorted priority
 */

import type { IField } from "../../interfaces/Field"
import type { IQueueItem } from "../../interfaces/Queue"

export function priorityQueue() {
    const collection: IQueueItem[] = []

    const isEmpty = (): boolean => collection.length === 0

    // when a new item is enqueued, iterate through collection to add item in correct position
    const enqueue = (key: IField, priority: number): void => {
        // only add item to collection if it doesn't exist in array
        if (!collection.some(e => e.key === key)) {
            if (isEmpty()) {
                collection.push({ key, priority })
            } else {
                let added = false
                for (let i = 1; i <= collection.length; i++) {
                    if (priority < collection[i - 1].priority) {
                        collection.splice(i - 1, 0, { key, priority })
                        added = true
                        break
                    }
                }
                if (!added) {
                    collection.push({ key, priority })
                }
            }
        }
    }

    // removes the first item from the collection
    const dequeue = (): IQueueItem | undefined => {
        let value = collection.shift()
        return value
    }

    // remove all elements from the start that have the same prio as the first one
    const dequeueAllLowest = (): IQueueItem[] => {
        let array = []
        const firstEl = collection.shift()
        if (firstEl) {
            const lowestPrio = firstEl?.priority
            array.push(firstEl)

            while (!isEmpty() && collection[0].priority === lowestPrio) {
                const nextEl = collection.shift()
                if (nextEl) {
                    array.push(nextEl)
                }
            }

        }
        return array || []
    }

    // returns the collection and functions as read-only
    return Object.freeze({
        isEmpty,
        dequeue,
        enqueue,
        collection,
        dequeueAllLowest
    })
}