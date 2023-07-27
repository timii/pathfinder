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
export function getAllNeighbourFieldPositions(grid: IField[][], firstIndex: number, secondIndex: number) {
    console.log("getAllNeighbourFields -> grid:", grid, firstIndex, secondIndex)
    const neighbours = []
    const rowMax = grid[0].length
    const colMax = grid.length

    if (isFieldEmtpy(grid, firstIndex - 1, secondIndex)) {
        neighbours.push(grid[firstIndex - 1][secondIndex])
    }

    console.log("getAllNeighbourFieldPositions -> neighbours:", neighbours)
    return neighbours
}

function isFieldEmtpy(grid: IField[][], firstIndex: number, secondIndex: number) {
    const field = grid[firstIndex][secondIndex]
    console.log("isFieldSearched -> el:", field, firstIndex, secondIndex)
    if (field) {
        console.log("field.searched || field.start || field.finish || field.path:", field.searched || field.start || field.finish || field.path)
        return !(field.searched || field.start || field.finish || field.path)
    }
}
