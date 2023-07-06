import type { IAlgorithm } from "../interfaces/Algorithm";
import { aStar } from "./a-star";

export const algorithms: IAlgorithm[] = [
    {
        name: "testName1",
        functionCallback: aStar,
    },
    {
        name: "testName2",
    },
    {
        name: "testName3",
    },
];
