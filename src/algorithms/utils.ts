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
