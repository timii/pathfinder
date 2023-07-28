import type { IField } from "../interfaces/Field";
import { currentGrid } from "../store/store";
import { getAllAdjacentFieldPositions, getFieldPosition, isEveryFieldSearched } from "./utils";

// function for the breadth first search algorithm
export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldPosition(grid, "start")
    const finishNode = getFieldPosition(grid, "finish")
    if (startNode) {
        const neighbours = getAllAdjacentFieldPositions(grid, startNode.firstIndex, startNode.secondIndex)
        console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode, "colMax:", colMax, "rowMax:", rowMax, "neighbours:", neighbours);
        if (neighbours.length > 0) {
            neighbours.forEach(field => grid[field.firstIndex][field.secondIndex].searched = true)
        }
    }

    // let gridTest: IField[][] = JSON.parse(JSON.stringify(grid))
    // grid[0][0].searched = true
    currentGrid.set(grid)
    console.log("bfs function called -> grid after:", grid, "isEveryFieldSearched:", isEveryFieldSearched(grid));

    return [1, 2, 3];
}