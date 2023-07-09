import type { IAlgorithm } from "../interfaces/Algorithm";
import { aStar } from "./a-star";
import { bfs } from "./bfs";

export const algorithms: IAlgorithm[] = [
    {
        name: "Breadth First Search",
        functionCallback: bfs,
    },
    {
        name: "Depth First Search",
    },
    {
        name: "Dijkstra's Algorithm",
    },
    {
        name: "A*",
        functionCallback: aStar,
    },
];
