import type { IField } from "./Field";

export interface IQueueItem {
    key: IField,
    priority: number
}