import type { IField } from "./Field";

export interface IAlgorithm {
    name: string;
    functionCallback?: (grid: IField[][]) => number[];
}
