import type { IAlgorithm } from "../interfaces/Algorithm";
import { aStar } from "./a-star";

export const algorithms: IAlgorithm[] = [
    {
        name: "testName",
        functionCallback: aStar,
    },
];
