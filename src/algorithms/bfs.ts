import type { IField } from "../interfaces/Field";
import { currentGrid } from "../store/store";
import { getFieldPosition } from "./utils";

// function for the breadth first search algorithm
export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldPosition(grid, "start")
    const finishNode = getFieldPosition(grid, "finish")
    console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode, "colMax:", colMax, "rowMax:", rowMax);

    let gridTest: IField[][] = JSON.parse(JSON.stringify(grid))
    gridTest[0][0].searched = true
    currentGrid.set(gridTest)
    console.log("bfs function called -> grid after:", gridTest, "initial grid:", grid);

    return [1, 2, 3];
}
