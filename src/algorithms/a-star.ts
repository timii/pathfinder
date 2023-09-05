import type { IField } from "../interfaces/Field";
import type { IQueueItem } from "../interfaces/Queue";
import { currentGrid } from "../store/store";
import { priorityQueue } from "./utils/priorityQueue";
import { getFieldByProp, getAllAdjacentFields, isEveryFieldSearched, getStepCost, finishedSearching, arrayContainsFinish } from "./utils/utils";

export function aStar(grid: IField[][]) {

    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldByProp(grid, "start")
    const finishNode = getFieldByProp(grid, "finish")

    if (startNode && finishNode) {

        // create new priorityQueue and add the startNode to it with a priority of 0
        let queue = priorityQueue()
        queue.enqueue(startNode, 0)

        // create map to keep track of distances to each field
        let distances = new Map<IField, number>([[startNode, 0]])
        // keep track of all the fields to check next
        let fieldsToCheck: IField[] = []
        // keep track of unique neighbours
        let neighbours: Set<IField> = new Set()
        // keep track of where we came from to construct path later
        let cameFromMap = new Map<number, number>()

        const searchInterval = setInterval(() => {

            const lowestPrioElements: IQueueItem[] = [queue.dequeue()!]
            fieldsToCheck = lowestPrioElements.map(item => item.key)
            neighbours.clear()

            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach((field) => {

                    // mark each field as searched
                    if (!field.start && !field.finish) {
                        field.searched = true
                    }

                    // get all neighbours of the current field
                    getAllAdjacentFields(grid, field.x, field.y).forEach(neighbour => {
                        // calculate distance from current neighbur to finish to prioritize neighbours closer to the finish 
                        const stepCost = (distances.get(field) || 0) + getStepCost(neighbour)
                        const finishDistance = Math.abs(finishNode.x - neighbour.x) + Math.abs(finishNode.y - neighbour.y)
                        const newDistance = stepCost + finishDistance

                        // add calculated distance to map to know how much the step to the neighbour costs
                        if (!distances.has(neighbour)) {
                            distances.set(neighbour, stepCost)
                        }

                        // add neighbour + calculated distance to queue 
                        queue.enqueue(neighbour, newDistance)

                        // add neighbour key + currenf field value into map
                        if (!cameFromMap.has(neighbour.id)) {
                            cameFromMap.set(neighbour.id, field.id)
                        }

                        // add unique neighbours to neighbours array
                        neighbours.add(neighbour)

                        // mark each neighbour as searched
                        if (!neighbour.start && !neighbour.finish) {
                            neighbour.searched = true
                        }
                    })
                })

                currentGrid.set(grid)


                // check if we have arrived at the finish field
                if (isEveryFieldSearched(grid) || arrayContainsFinish(Array.from(neighbours)) || cameFromMap.has(finishNode.id) || queue.isEmpty()) {

                    finishedSearching(grid, searchInterval, cameFromMap, startNode, finishNode, colMax * rowMax)
                }
            }
        }, 50)
    }

}
