import type { IField } from "../interfaces/Field";
import type { IPositionWithId } from "../interfaces/Position";
import { currentGrid } from "../store/store";
import { drawShortestPath, getAllAdjacentFieldPositions, getFieldPositionById, getFieldPositionByProp, getShortestPath, isEveryFieldSearched, isFieldEmtpyAndExist } from "./utils";

// function for the breadth first search algorithm
export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldPositionByProp(grid, "start")
    const finishNode = getFieldPositionByProp(grid, "finish")
    // map to keep track of where we came from (key: next field, value: current field)
    let cameFromMap = new Map<number, number>()

    if (startNode && finishNode) {
        let fieldsToCheck: IPositionWithId[] = [startNode]
        let fieldsToCheckWithoutStartAndFinish: IPositionWithId[] = []
        let neighbours: IPositionWithId[] = []

        const searchInterval = setInterval(() => {
            console.log("in while -> fieldsToCheck:", fieldsToCheck, "neighbours:", neighbours, "cameFromMap:", cameFromMap)
            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach(field => {
                    neighbours.push(...getAllAdjacentFieldPositions(grid, field.firstIndex, field.secondIndex))
                    neighbours.forEach(el => {
                        if (!cameFromMap.has(el.id)) {
                            cameFromMap.set(el.id, field.id)
                        }
                    })
                })

                // const neighbours = getAllAdjacentFieldPositions(grid, startNode.firstIndex, startNode.secondIndex)
                console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode, "neighbours:", neighbours, "cameFromMap:", cameFromMap);

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
                    const path = getShortestPath(cameFromMap, startNode.id, finishNode.id, colMax * rowMax)

                    // draw path to grid
                    drawShortestPath(grid, path)
                }
            }
        }, 50)
    }

    console.log("bfs function called -> grid after:", grid, "isEveryFieldSearched:", isEveryFieldSearched(grid));
}