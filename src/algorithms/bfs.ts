import type { IField } from "../interfaces/Field";
import { getStartPosition, getFinsishPosition } from "./utils";

export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    const startNode = getStartPosition(grid)
    const finishNode = getFinsishPosition(grid)
    console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode);
    return [1, 2, 3];
}
