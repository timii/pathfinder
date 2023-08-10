import type { IAlgorithm } from "../interfaces/Algorithm";
import { aStar } from "./a-star";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";

export const algorithms: IAlgorithm[] = [
    {
        name: "Breadth First Search",
        functionCallback: bfs,
    },
    {
        name: "Depth First Search",
        functionCallback: dfs
    },
    {
        name: "Dijkstra's Algorithm",
        functionCallback: dijkstra,
    },
    {
        name: "A*",
        functionCallback: aStar,
    },
];
