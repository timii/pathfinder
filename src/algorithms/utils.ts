import type { IField, IFieldProp } from "../interfaces/Field";

// function to return the indeces of a given field
export function getFieldPosition(grid: IField[][], property: IFieldProp): { firstIndex: number, secondIndex: number } | undefined {
    // console.log("getFieldPosition -> grid:", grid)
    for (var i = 0; i < grid.length; i++) {
        var index = grid[i].findIndex(field => field[property] === true);
        if (index > -1) {
            let pos = { firstIndex: i, secondIndex: index };
            // console.log("getFieldPosition -> pos in for loop:", pos)
            return pos
        }
    }
    return undefined
}
