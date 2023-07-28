import type { IField, IFieldProp } from "../interfaces/Field";
import type { IPosition } from "../interfaces/Position";

// function to return the indeces of a given field
export function getFieldPosition(grid: IField[][], property: IFieldProp): IPosition | undefined {
    // console.log("getFieldPosition -> grid:", grid)
    for (var i = 0; i < grid.length; i++) {
        var index = grid[i].findIndex(field => field[property] === true);
        if (index > -1) {
            let pos: IPosition = { firstIndex: i, secondIndex: index };
            // console.log("getFieldPosition -> pos in for loop:", pos)
            return pos
        }
    }
    return undefined
}

export function getRandomInt(min = 1, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

// function to get all adjacent fields to a given position
export function getAllAdjacentFieldPositions(grid: IField[][], firstIndex: number, secondIndex: number) {
    console.log("getAllNeighbourFields -> grid:", grid, firstIndex, secondIndex)
    const neighbours: IPosition[] = []
    const rowMax = grid[0].length
    const colMax = grid.length

    if (isFieldEmtpyAndExist(grid, firstIndex - 1, secondIndex)) {
        neighbours.push({ firstIndex: firstIndex - 1, secondIndex })
    }
    if (isFieldEmtpyAndExist(grid, firstIndex + 1, secondIndex)) {
        neighbours.push({ firstIndex: firstIndex + 1, secondIndex })
    }
    if (isFieldEmtpyAndExist(grid, firstIndex, secondIndex - 1)) {
        neighbours.push({ firstIndex, secondIndex: secondIndex - 1 })
    }
    if (isFieldEmtpyAndExist(grid, firstIndex, secondIndex + 1)) {
        neighbours.push({ firstIndex, secondIndex: secondIndex + 1 })
    }

    console.log("getAllNeighbourFieldPositions -> neighbours:", neighbours)
    return neighbours
}

export function isFieldEmtpyAndExist(grid: IField[][], firstIndex: number, secondIndex: number) {
    const field = grid[firstIndex][secondIndex]
    console.log("isFieldEmtpyAndExist -> el:", field, firstIndex, secondIndex)
    if (field) {
        console.log("field.searched || field.start || field.finish || field.path:", field.searched || field.start || field.finish || field.path)
        return !(field.searched || field.start || field.finish || field.path)
    } else {
        return false
    }
}

export function isEveryFieldSearched(grid: IField[][]) {
    return grid.every((row, i) => row.every((_, j) => !isFieldEmtpyAndExist(grid, i, j)))
}
