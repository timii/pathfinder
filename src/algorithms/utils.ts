import type { IField } from "../interfaces/Field";

// function to return the indeces of the starting field
export function getStartPosition(grid: IField[][]) {
    console.log("getStartPosition -> grid:", grid)
    const start = grid.find(row => {
        row.find(field => field.start === true)
    })
    console.log("getStartPosition -> start:", start)
}

// function to return the indeces of the finish field
export function getFinsishPosition(grid: IField[][]) {
    console.log("getFinsishPosition -> grid:", grid)
    const finish = grid.find(row => {
        row.find(field => field.finish === true)
    })
    console.log("getStartPosition -> finish:", finish)
}
