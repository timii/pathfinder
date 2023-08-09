export interface IPosition {
    firstIndex: number,
    secondIndex: number
}

export type IPositionWithId = IPosition & { id: number }

export type IPositionWithIdAndPrio = IPosition & { id: number } & { prio: number }