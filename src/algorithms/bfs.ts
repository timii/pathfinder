import type { IField } from "../interfaces/Field";
import type { IPosition } from "../interfaces/Position";
import { currentGrid } from "../store/store";
import { getAllAdjacentFieldPositions, getFieldPosition, isEveryFieldSearched } from "./utils";

// function for the breadth first search algorithm
export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldPosition(grid, "start")
    const finishNode = getFieldPosition(grid, "finish")
    if (startNode && finishNode) {
        let fieldsToCheck: IPosition[] = [startNode]
        let neighbours: IPosition[] = []
        let i = 0;

        const searchInterval = setInterval(() => {

            // while (i < 3) {
            console.log("in while -> i:", i, "fieldsToCheck:", fieldsToCheck, "neighbours:", neighbours)
            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach(field => neighbours.push(...getAllAdjacentFieldPositions(grid, field.firstIndex, field.secondIndex)))

                // const neighbours = getAllAdjacentFieldPositions(grid, startNode.firstIndex, startNode.secondIndex)
                console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode, "neighbours:", neighbours);
                if (neighbours.length > 0) {
                    fieldsToCheck = []

                    // new fields to check are the neighbours from the field that we checked before
                    fieldsToCheck.push(...neighbours)
                    neighbours.forEach(field => grid[field.firstIndex][field.secondIndex].searched = true)
                }
                i++;
                currentGrid.set(grid)

                console.log("end of interval -> isEveryFieldSearched(grid):", isEveryFieldSearched(grid))

                // stop checking for fields if every field is not empty
                if (isEveryFieldSearched(grid)) {
                    clearInterval(searchInterval)
                }
            }
            // }
        }, 1000)
    }

    // let gridTest: IField[][] = JSON.parse(JSON.stringify(grid))
    // grid[0][0].searched = true
    console.log("bfs function called -> grid after:", grid, "isEveryFieldSearched:", isEveryFieldSearched(grid));

    return [1, 2, 3];
}