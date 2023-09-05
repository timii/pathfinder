import type { IField } from "../interfaces/Field";
import type { IPosition } from "../interfaces/Position";
import { currentGrid, isVisualizing } from "../store/store";
import { CONSTS } from "../utils/consts";
import { calculateLastDirection, finishedSearching, getFieldByProp, getNextField, isEveryFieldSearched } from "../utils/utils";

export function dfs(grid: IField[][]) {
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldByProp(grid, "start")
    const finishNode = getFieldByProp(grid, "finish")

    if (startNode && finishNode) {

        // keep track of where we came from to construct path later
        let cameFromMap = new Map<number, number>()
        // set a default direction of going up at the start
        let lastDircetion: IPosition = { firstIndex: -1, secondIndex: 0 }
        // keep track of all the fields to check next
        let fieldsToCheck: IField[] = [startNode]
        // keep track of unique neighbours
        let neighbours: Set<IField> = new Set([startNode])
        // keep track of the last three fields visited
        let lastThreeFields: IField[] = [startNode]

        const searchInterval = setInterval(() => {

            fieldsToCheck = [...Array.from(neighbours)]
            neighbours.clear()

            if (fieldsToCheck.length > 0) {

                fieldsToCheck.forEach(field => {
                    const nextField = getNextField(grid, field.y, field.x, rowMax, colMax, lastDircetion)
                    if (nextField) {

                        neighbours = new Set([nextField])

                        // mark each field as searched
                        if (!field.start && !field.finish) {
                            field.searched = true
                        }

                        // keep track of the last fields visited
                        if (lastThreeFields.length !== 3) {
                            lastThreeFields.push(nextField)
                        } else {
                            lastThreeFields.shift()
                            lastThreeFields.push(nextField)
                        }

                        // keep track of the last direction we searched
                        lastDircetion = calculateLastDirection(lastThreeFields[1], lastThreeFields[0])

                        // fill cameFromMap to later draw the path from finish to start
                        neighbours.forEach(el => {
                            if (!cameFromMap.has(el.id)) {
                                cameFromMap.set(el.id, field.id)
                            }
                        })
                    } else {
                        clearInterval(searchInterval)
                        isVisualizing.set(false)
                    }
                })
            }

            currentGrid.set(grid)


            // stop checking for fields if every field is not empty or a path to the finish field has been found
            if (isEveryFieldSearched(grid) || cameFromMap.has(finishNode.id) || neighbours.size === 0) {

                finishedSearching(grid, searchInterval, cameFromMap, startNode, finishNode, colMax * rowMax)
            }
        }, CONSTS.searchIntervallSpeed)
    }
}