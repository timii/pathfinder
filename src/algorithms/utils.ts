import type { IField, IFieldProp } from "../interfaces/Field";
import type { IPositionWithId } from "../interfaces/Position";
import { currentGrid, isVisualizing } from "../store/store";

// function to return the indeces of a field using its prop name
export function getFieldPositionByProp(grid: IField[][], property: IFieldProp): IPositionWithId | undefined {
    // console.log("getFieldPosition -> grid:", grid)
    for (var i = 0; i < grid.length; i++) {
        var index = grid[i].findIndex(field => field[property] === true);
        if (index > -1) {
            let pos: IPositionWithId = { firstIndex: i, secondIndex: index, id: grid[i][index].id };
            // console.log("getFieldPosition -> pos in for loop:", pos)
            return pos
        }
    }
    return undefined
}

// function to return the indeces of a field using its id
export function getFieldPositionById(grid: IField[][], id: number) {
    for (var i = 0; i < grid.length; i++) {
        var index = grid[i].findIndex(field => field.id === id);
        if (index > -1) {
            let pos: IPositionWithId = { firstIndex: i, secondIndex: index, id };
            // console.log("getFieldPosition -> pos in for loop:", pos)
            return pos
        }
    }
    return undefined
}

// get a random integer between a given min and max
export function getRandomInt(min = 1, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

// function to get all adjacent fields to a given position
export function getAllAdjacentFieldPositions(grid: IField[][], firstIndex: number, secondIndex: number) {
    const neighbours: IPositionWithId[] = []
    const rowMax = grid[0].length
    const colMax = grid.length
    // console.log("getAllAdjacentFieldPositions -> grid:", grid, firstIndex, secondIndex, "rowMax:", rowMax, "colMax:", colMax)

    // check field above
    const fieldAbove = [firstIndex - 1, secondIndex]
    if (firstIndex - 1 >= 0 && isFieldEmtpyAndExist(grid, fieldAbove[0], fieldAbove[1])) {
        neighbours.push({ firstIndex: fieldAbove[0], secondIndex: fieldAbove[1], id: grid[fieldAbove[0]][fieldAbove[1]].id })
    }

    // check field below
    const fieldBelow = [firstIndex + 1, secondIndex]
    if (firstIndex + 1 < colMax && isFieldEmtpyAndExist(grid, fieldBelow[0], fieldBelow[1])) {
        neighbours.push({ firstIndex: fieldBelow[0], secondIndex: fieldBelow[1], id: grid[fieldBelow[0]][fieldBelow[1]].id })
    }

    // check field to the left
    const fieldToTheLeft = [firstIndex, secondIndex - 1]
    if (secondIndex - 1 >= 0 && isFieldEmtpyAndExist(grid, fieldToTheLeft[0], fieldToTheLeft[1])) {
        neighbours.push({ firstIndex: fieldToTheLeft[0], secondIndex: fieldToTheLeft[1], id: grid[fieldToTheLeft[0]][fieldToTheLeft[1]].id })
    }

    // check field to the right
    const fieldToTheRight = [firstIndex, secondIndex + 1]
    if (secondIndex + 1 < rowMax && isFieldEmtpyAndExist(grid, fieldToTheRight[0], fieldToTheRight[1])) {
        neighbours.push({ firstIndex: fieldToTheRight[0], secondIndex: fieldToTheRight[1], id: grid[fieldToTheRight[0]][fieldToTheRight[1]].id })
    }

    console.log("getAllAdjacentFieldPositions -> neighbours:", neighbours)
    return neighbours
}

// function to check if a field at given indeces exists and if it's empty 
export function isFieldEmtpyAndExist(grid: IField[][], firstIndex: number, secondIndex: number, includeStartAndFinish?: boolean) {
    const field = grid[firstIndex][secondIndex]
    // console.log("isFieldEmtpyAndExist -> el:", field, firstIndex, secondIndex)
    if (field) {
        // console.log("field.searched || field.start || field.finish || field.path:", field.searched || field.start || field.finish || field.path)
        if (includeStartAndFinish) {
            return !(field.searched || field.path || field.wall || field.start || field.finish)
        } else {
            return !(field.searched || field.path || field.wall)
        }
    } else {
        return false
    }
}

// function to check if every field is either searched or either a start, finish or wall field
export function isEveryFieldSearched(grid: IField[][]) {
    return grid.every((row, i) => row.every((_, j) => !isFieldEmtpyAndExist(grid, i, j)))
}

// function to get the shortest path using a given map of ids
export function getShortestPath(cameFromMap: Map<number, number>, startId: number, finishId: number) {
    let current = finishId
    console.log("before while -> current:", current, "cameFromMap:", cameFromMap)
    let path: number[] = []
    while (current !== startId && path.length < 50) {
        path.push(current)
        console.log("in while -> path:", path, "cameFromMap.get(current):", cameFromMap.get(current))
        if (cameFromMap.has(current)) {
            current = cameFromMap.get(current)!
        }
    }
    path.push(startId)
    return path
}

export function drawShortestPath(grid: IField[][], path: number[]) {
    if (path.length > 0) {
        const pathInterval = setInterval(() => {
            if (path.length > 0) {
                const nextPathElement = path.shift()
                const nextFieldIndeces = getFieldPositionById(grid, nextPathElement!)
                if (nextFieldIndeces) {
                    const nextField = grid[nextFieldIndeces.firstIndex][nextFieldIndeces.secondIndex]
                    if (!nextField.start && !nextField.finish) {
                        nextField.path = true
                    }
                }
                if (path.length === 0) {
                    isVisualizing.set(false)
                }
            } else {
                isVisualizing.set(false)
                console.log("clear path interval")
                clearInterval(pathInterval)
            }
            currentGrid.set(grid)
        }, 500)
    }
}
