export interface IPosition {
    firstIndex: number,
    secondIndex: number
}

export type IPositionWithId = IPosition & { id: number }

export type IPositionWithIdAndWeight = IPosition & { id: number } & { weight: number }