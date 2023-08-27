import type { IField } from "../interfaces/Field";
import { currentGrid } from "../store/store";
import { drawShortestPath, getAllAdjacentFields, getFieldByProp, getShortestPath } from "./utils/utils";

// function for the breadth first search algorithm
export function bfs(grid: IField[][]) {

    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldByProp(grid, "start")
    const finishNode = getFieldByProp(grid, "finish")

    if (startNode && finishNode) {

        // keep track of all the fields to check next
        let fieldsToCheck: IField[] = [startNode]
        // keep track of unique neighbours
        let neighbours: Set<IField> = new Set([startNode])
        // keep track of where we came from to construct path later
        let cameFromMap = new Map<number, number>()

        const searchInterval = setInterval(() => {

            fieldsToCheck = [...Array.from(neighbours)]

            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach((field) => {

                    // mark each field as searched
                    if (!field.start && !field.finish) {
                        field.searched = true
                    }

                    // get all neighbours of the current field
                    getAllAdjacentFields(grid, field.x, field.y).forEach(neighbour => {

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
                if (Array.from(neighbours).some(e => e.finish === true) || cameFromMap.has(finishNode.id)) {
                    clearInterval(searchInterval)

                    // get path from start to finish
                    const path = getShortestPath(cameFromMap, startNode.id, finishNode.id, colMax * rowMax)

                    // draw path to grid
                    drawShortestPath(grid, path)
                }
            }
        }, 50)
    }
}