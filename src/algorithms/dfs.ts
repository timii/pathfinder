import type { IField } from "../interfaces/Field";
import type { IPosition, IPositionWithId } from "../interfaces/Position";
import { currentGrid } from "../store/store";
import { drawShortestPath, getFieldPositionByProp, getNextField, getShortestPath, isEveryFieldSearched, isFieldEmtpyAndExist } from "./utils";

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

    if (startNode && finishNode) {
        let fieldsToCheck: IPositionWithId[] = [startNode]
        let fieldsToCheckWithoutStartAndFinish: IPositionWithId[] = []
        let neighbours: IPositionWithId[] = [startNode]
        let lastTwoFields: IPositionWithId[] = [startNode]
        let rightTurnAmount = 0
        let lastRowIndex = 0

        let i = 0;
        const searchInterval = setInterval(() => {
            i++;

            if (fieldsToCheck.length > 0) {
                fieldsToCheck.forEach(field => {
                    console.log("dfs -> field:", field, field.firstIndex, field.secondIndex, "i:", i)
                    const nextField = getNextField(grid, field.firstIndex, field.secondIndex, rowMax, colMax, lastDircetion, rightTurnAmount, lastRowIndex)
                    if (nextField) {
                        // if (turnedRight) {
                        //     rightTurnAmount++
                        // }

                        neighbours = [nextField]

                        // keep track of the last two fields visited
                        if (lastTwoFields.length !== 2) {
                            lastTwoFields.push(nextField)
                        } else {
                            lastTwoFields.shift()
                            lastTwoFields.push(nextField)
                        }

                        // calculate the direction we moved last by using the last two fields
                        const lastYDirection = lastTwoFields[1].firstIndex - lastTwoFields[0].firstIndex
                        const lastXDirection = lastTwoFields[1].secondIndex - lastTwoFields[0].secondIndex
                        lastDircetion = { firstIndex: lastYDirection, secondIndex: lastXDirection }

                        // neighbours.push(...[{ firstIndex: field.firstIndex - 1, secondIndex: field.secondIndex, id: grid[field.firstIndex][field.secondIndex].id }])
                        console.log("dfs -> neighbours after:", neighbours, "lastDircetion:", lastDircetion, "lastTwoFields:", lastTwoFields[0], lastTwoFields[1], "nextField:", nextField)

                        fieldsToCheck.forEach(field => {
                            // neighbours.push(...getAllAdjacentFieldPositions(grid, field.firstIndex, field.secondIndex))
                            neighbours.forEach(el => {
                                if (!cameFromMap.has(el.id)) {
                                    cameFromMap.set(el.id, field.id)
                                }
                            })
                            // console.log("in for each -> field:", field, "neighbours:", neighbours)
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
            if (i === 50 || isEveryFieldSearched(grid) || cameFromMap.has(finishNode.id) || fieldsToCheckWithoutStartAndFinish.length === 0) {
                clearInterval(searchInterval)

                // get path from start to finish
                const path = getShortestPath(cameFromMap, startNode.id, finishNode.id)

                // draw path to grid
                drawShortestPath(grid, path)
            }
        }, 50)
    }

}