import type { IField } from "../interfaces/Field";
import type { IQueueItem } from "../interfaces/Queue";
import { currentGrid, pathStepCost } from "../store/store";
import { priorityQueue } from "./utils/priorityQueue";
import { getFieldByProp, getAllAdjacentFields, getStepCost, isEveryFieldSearched, getShortestPath, drawShortestPath } from "./utils/utils";

export function gbfs(grid: IField[][]) {

    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldByProp(grid, "start")
    const finishNode = getFieldByProp(grid, "finish")
    let finalCost = 0

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

            // const lowestPrioElements: IQueueItem[] = [queue.dequeue()!]
            const lowestPrioElements: IQueueItem[] = queue.dequeueAllLowest()
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
                        // calculate distance from current field to finish to prioritize fields closer to the finish 
                        const newDistance = Math.abs(finishNode.x - field.x) + Math.abs(finishNode.y - field.y)

                        // add calculated distance to map to know how much the step to the neighbour costs
                        if (!distances.has(neighbour)) {
                            distances.set(neighbour, newDistance)
                        }

                        // add neighbour + calculated distance to queue 
                        queue.enqueue(neighbour, newDistance)

                        // add neighbour key + currenf field value into map
                        if (!cameFromMap.has(neighbour.id)) {
                            cameFromMap.set(neighbour.id, field.id)
                        }

                        // add unique neighbours to neighbours array
                        neighbours.add(neighbour)
                    })
                })

                currentGrid.set(grid)


                // check if we have arrived at the finish field
                if (isEveryFieldSearched(grid) || Array.from(neighbours).some(e => e.finish === true) || cameFromMap.has(finishNode.id) || neighbours.size === 0) {
                    finalCost = lowestPrioElements[0].priority

                    clearInterval(searchInterval)

                    // only get and draw shortest path when we reached the finish
                    const reachedFinish = cameFromMap.has(finishNode.id)
                    if (reachedFinish) {

                        // add one to the final cost to include the step to the finish
                        pathStepCost.set(finalCost + 1)

                        // get path from start to finish
                        const path = getShortestPath(cameFromMap, startNode.id, finishNode.id, colMax * rowMax)

                        // draw path to grid
                        drawShortestPath(grid, path)
                    }
                }
            }
        }, 50)
    }
}