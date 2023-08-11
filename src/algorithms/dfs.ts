import type { IField } from "../interfaces/Field";
import type { IPosition, IPositionWithId } from "../interfaces/Position";
import { currentGrid } from "../store/store";
import { calculateLastDirection, drawShortestPath, getFieldPositionByProp, getNextField, getShortestPath, isEveryFieldSearched, isFieldEmtpyAndExist } from "./utils";

export function dfs(grid: IField[][]) {
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldPositionByProp(grid, "start")
    const finishNode = getFieldPositionByProp(grid, "finish")
    console.log("dfs function called -> startNode:", startNode, "finsihNode:", finishNode);
    // map to keep track of where we came from (key: next field, value: current field)
    let cameFromMap = new Map<number, number>()
    // set a default direction of going up at the start
    let lastDircetion: IPosition = { firstIndex: -1, secondIndex: 0 }
    let beforeLastDircetion: IPosition

    if (startNode && finishNode) {
        let fieldsToCheck: IPositionWithId[] = [startNode]
        let fieldsToCheckWithoutStartAndFinish: IPositionWithId[] = []
        let neighbours: IPositionWithId[] = [startNode]
        let lastThreeFields: IPositionWithId[] = [startNode]

        const searchInterval = setInterval(() => {

            if (fieldsToCheck.length > 0) {
                fieldsToCheck.forEach(field => {
                    console.log("dfs -> field:", field, field.firstIndex, field.secondIndex)
                    const nextField = getNextField(grid, field.firstIndex, field.secondIndex, rowMax, colMax, lastDircetion, beforeLastDircetion)
                    if (nextField) {
                        console.log("next field is defined:", nextField)

                        neighbours = [nextField]

                        // keep track of the last fields visited
                        if (lastThreeFields.length !== 3) {
                            lastThreeFields.push(nextField)
                        } else {
                            lastThreeFields.shift()
                            lastThreeFields.push(nextField)
                        }


                        lastDircetion = calculateLastDirection(lastThreeFields[1], lastThreeFields[0])

                        if (lastThreeFields.length > 2) {
                            beforeLastDircetion = calculateLastDirection(lastThreeFields[2], lastThreeFields[1])
                        }

                        // fill cameFromMap to later draw the path from finish to start
                        fieldsToCheck.forEach(field => {
                            neighbours.forEach(el => {
                                if (!cameFromMap.has(el.id)) {
                                    cameFromMap.set(el.id, field.id)
                                }
                            })
                        })
                    } else {
                        clearInterval(searchInterval)
                    }
                })
            }

            if (neighbours.length > 0) {
                fieldsToCheck = []

                // new fields to check are the neighbours from the field that we checked before
                fieldsToCheck = [...neighbours]

                // create a second array with all neighbours in it, but filter every field out that isn't empty
                fieldsToCheckWithoutStartAndFinish = neighbours.filter((el => isFieldEmtpyAndExist(grid, el.firstIndex, el.secondIndex, true)))

                // mark each neighbour as searched 
                neighbours.forEach(field => {
                    const element = grid[field.firstIndex][field.secondIndex]
                    if (!element.start && !element.finish)
                        element.searched = true
                })
                neighbours = []
            }
            currentGrid.set(grid)


            // stop checking for fields if every field is not empty or a path to the finish field has been found
            if (isEveryFieldSearched(grid) || cameFromMap.has(finishNode.id) || fieldsToCheckWithoutStartAndFinish.length === 0) {
                clearInterval(searchInterval)

                // get path from start to finish
                const path = getShortestPath(cameFromMap, startNode.id, finishNode.id)

                // draw path to grid
                drawShortestPath(grid, path)
            }
        }, 50)
    }

}