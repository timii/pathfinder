import type { IField } from "../interfaces/Field";
import { getFieldPosition } from "./utils";

export function bfs(grid: IField[][]) {
    console.log("bfs function called -> grid:", grid);
    const startNode = getFieldPosition(grid, "start")
    const finishNode = getFieldPosition(grid, "finish")
    console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode);
    return [1, 2, 3];
}
