import type { IField } from "../interfaces/Field";
import type { IPosition, IPositionWithId } from "../interfaces/Position";
import { currentGrid } from "../store/store";
import { drawShortestPath, getAllAdjacentFieldPositions, getFieldPositionById, getFieldPositionByProp, getShortestPath, isEveryFieldSearched } from "./utils";

// function for the breadth first search algorithm
export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    // const rowMax = grid[0].length
    // const colMax = grid.length
    const startNode = getFieldPositionByProp(grid, "start")
    const finishNode = getFieldPositionByProp(grid, "finish")
    // map to keep track of where we came from (key: next field, value: current field)
    let cameFromMap = new Map<number, number>()
    if (startNode && finishNode) {
        let fieldsToCheck: IPositionWithId[] = [startNode]
        let neighbours: IPositionWithId[] = []
        let i = 0;

        const searchInterval = setInterval(() => {
            console.log("in while -> i:", i, "fieldsToCheck:", fieldsToCheck, "neighbours:", neighbours, "cameFromMap:", cameFromMap)
            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach(field => {
                    neighbours.push(...getAllAdjacentFieldPositions(grid, field.firstIndex, field.secondIndex))
                    neighbours.forEach(el => {
                        if (!cameFromMap.has(el.id)) {
                            cameFromMap.set(el.id, field.id)
                        }
                    })
                    // console.log("in for each -> field:", field, "neighbours:", neighbours)
                })

                // const neighbours = getAllAdjacentFieldPositions(grid, startNode.firstIndex, startNode.secondIndex)
                console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode, "neighbours:", neighbours, "cameFromMap:", cameFromMap);

                if (neighbours.length > 0) {
                    fieldsToCheck = []

                    // add neighbours as keys to cameFromMap and use 

                    // new fields to check are the neighbours from the field that we checked before
                    fieldsToCheck.push(...neighbours)
                    neighbours.forEach(field => {
                        const element = grid[field.firstIndex][field.secondIndex]
                        if (!element.start && !element.finish)
                            element.searched = true
                    })
                }
                currentGrid.set(grid)

                console.log("end of interval -> isEveryFieldSearched(grid):", isEveryFieldSearched(grid))

                // stop checking for fields if every field is not empty or a path to the finish field has been found
                if (isEveryFieldSearched(grid) || cameFromMap.has(finishNode.id)) {
                    clearInterval(searchInterval)

                    // get path from start to finish
                    const path = getShortestPath(cameFromMap, startNode.id, finishNode.id)

                    // draw path to grid
                    drawShortestPath(grid, path)
                }
            }
        }, 500)
    }

    console.log("bfs function called -> grid after:", grid, "isEveryFieldSearched:", isEveryFieldSearched(grid));

    return [1, 2, 3];
}