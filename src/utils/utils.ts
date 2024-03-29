import { get } from "svelte/store";
import type { IField, IFieldProp } from "../interfaces/Field";
import type { IPosition } from "../interfaces/Position";
import { currentGrid, fieldsSearched, isVisualizing, isWeightedAlgo, pathLength, pathStepCost, showNoPathFound, showStats } from "../store/store";

// find a field using its prop name
export function getFieldByProp(grid: IField[][], property: IFieldProp): IField | undefined {
    for (var i = 0; i < grid.length; i++) {
        var field = grid[i].find(field => field[property] === true);
        if (field) {
            return field
        }
    }
    return undefined
}

// find a field using its id
export function getFieldById(grid: IField[][], id: number) {
    for (var i = 0; i < grid.length; i++) {
        var field = grid[i].find(field => field.id === id);
        if (field) {
            return field
        }
    }
    return undefined
}

// get a random integer between a given min and max
export function getRandomInt(min = 1, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

// get the cost of a given neighbour field
export function getStepCost(neighbour: IField) {
    return neighbour.weight || 1
}

// check if a given field is the finish field
export function isFinish(field: IField) {
    return field.finish === true
}

// get all adjacent fields using a given x and y 
export function getAllAdjacentFields(grid: IField[][], x: number, y: number) {
    let neighbours: IField[] = []

    // create array of indeces for all directions
    let neighbourIndeces: number[][] = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]]

    neighbourIndeces.forEach(([nX, nY]) => {
        if (isMoveToFieldPossible(grid, { firstIndex: nY, secondIndex: nX })) {
            neighbours.push(grid[nY][nX])
        }
    })
    return neighbours || []
}


// check if a field at given indeces exists and if it's empty 
export function isFieldEmtpyAndExist(grid: IField[][], firstIndex: number, secondIndex: number, includeStartAndFinish?: boolean, includeOnlyStart?: boolean) {
    const field = grid[firstIndex][secondIndex]
    if (field) {
        if (includeStartAndFinish) {
            return !(field.searched || field.path || field.wall || field.start || field.finish)
        } else if (includeOnlyStart) {
            return !(field.searched || field.path || field.wall || field.start)
        } else {
            return !(field.searched || field.path || field.wall)
        }
    } else {
        return false
    }
}

// check if every field is either searched or either a start, finish or wall field
export function isEveryFieldSearched(grid: IField[][]) {
    const isGridFilled = grid.every((row, i) => row.every((_, j) => !isFieldEmtpyAndExist(grid, i, j)))
    if (isGridFilled) {
        isVisualizing.set(false)
    }
    return isGridFilled
}

// just for depth first search algorithm to get the next field given a grid and two indeces
export function getNextField(grid: IField[][], firstIndex: number, secondIndex: number, rowMax: number, colMax: number, lastDirection: IPosition) {

    // try to get to first row -> y index schould be 0 && top right element is empty
    if (firstIndex > 0 && grid && isFieldEmtpyAndExist(grid, 0, rowMax - 1) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
        // go up 
        return grid[firstIndex - 1][secondIndex]
    }

    // try to get to the right -> x index should be rowMax and top right field empty
    if (firstIndex === 0 && secondIndex < rowMax - 1 && isFieldEmtpyAndExist(grid, 0, rowMax - 1) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
        return grid[firstIndex][secondIndex + 1]
    }

    // if moving up and down is possible -> check direction to either move up or down
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 1, secondIndex: 0 }, colMax, rowMax) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax) && lastDirection) {
        const newFirstIndex = firstIndex + lastDirection.firstIndex
        const newSecondIndex = secondIndex + lastDirection.secondIndex
        return grid[newFirstIndex][newSecondIndex]
    }

    // move right if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
        return grid[firstIndex][secondIndex + 1]
    }

    // move down if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 1, secondIndex: 0 }, colMax, rowMax)) {
        return grid[firstIndex + 1][secondIndex]
    }

    // move up if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
        return grid[firstIndex - 1][secondIndex]
    }

    // move left if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: -1 }, colMax, rowMax)) {
        return grid[firstIndex][secondIndex - 1]
    }
}

// check if a move towards a given direction is possible
export function isMoveInDirectionPossible(grid: IField[][], curPosition: IPosition, direction: IPosition, colMax: number, rowMax: number) {
    const newFirstIndex = curPosition.firstIndex + direction.firstIndex
    const newSecondIndex = curPosition.secondIndex + direction.secondIndex
    return newFirstIndex < colMax && newFirstIndex >= 0 && newSecondIndex < rowMax && newSecondIndex >= 0 && isFieldEmtpyAndExist(grid, newFirstIndex, newSecondIndex, false, true)
}

// check if moving to a given neighbour is possible
export function isMoveToFieldPossible(grid: IField[][], neighbourIndeces: IPosition) {
    const rowMax = grid[0].length
    const colMax = grid.length

    return neighbourIndeces.firstIndex < colMax && neighbourIndeces.firstIndex >= 0 && neighbourIndeces.secondIndex < rowMax && neighbourIndeces.secondIndex >= 0 && isFieldEmtpyAndExist(grid, neighbourIndeces.firstIndex, neighbourIndeces.secondIndex, false, true)
}

// get the shortest path using a given map of ids
export function getShortestPath(cameFromMap: Map<number, number>, startId: number, finishId: number, amountOfFields: number) {
    let current = finishId
    let path: number[] = []
    while (current !== startId && path.length < amountOfFields) {
        path.push(current)
        if (cameFromMap.has(current)) {
            current = cameFromMap.get(current)!
        }
    }
    path.push(startId)

    // set pathLength for stats (-2 because we exclude start and finish field)
    pathLength.set(path.length - 2)

    return path
}

// draw a given path in a given grid
export function drawShortestPath(grid: IField[][], path: number[]) {
    // set fieldSearched value for stats
    let fieldsSearchedAmount = 0
    grid.forEach(row => row.forEach(field => {
        if (field.searched || field.start || field.finish) { fieldsSearchedAmount++ }
    }))
    fieldsSearched.set(fieldsSearchedAmount)

    if (path.length > 0) {
        const pathInterval = setInterval(() => {
            if (path.length > 0) {
                const nextPathElement = path.shift()
                const nextField = getFieldById(grid, nextPathElement!)
                if (nextField && !nextField.start && !nextField.finish) {
                    nextField.path = true
                }
                if (path.length === 0) {
                    isVisualizing.set(false)
                    showStats.set(true)
                }
            } else {
                isVisualizing.set(false)
                clearInterval(pathInterval)
                showStats.set(true)
            }
            currentGrid.set(grid)
        }, 50)
    }
}

// calculate the total step cost using the path and set it in the store
export function calculatePathStepCost(grid: IField[][], path: number[]) {
    let cost = 0;
    path.forEach(e => {
        const field = getFieldById(grid, e)
        cost += field ? field.weight : 0
    })

    // if the used algo is not a weighted one, ignore all weights and just use the path length
    if (!(get(isWeightedAlgo))) {
        cost = path.length
    }

    // subtract 1 to ignore the cost for the start 
    pathStepCost.set(cost - 1)
}

// calculate the last direction moved by using two given fields
export function calculateLastDirection(lastField: IField, currentField: IField) {
    const beforeLastYDirection = lastField.y - currentField.y
    const beforeLastXDirection = lastField.x - currentField.x
    return { firstIndex: beforeLastYDirection, secondIndex: beforeLastXDirection }
}

// handle the case when no path was found by the algorithm
export function noPathFound() {
    isVisualizing.set(false)
    showNoPathFound.set(true)
}

// clean up and handle path when algorithm is done searching
export function finishedSearching(grid: IField[][], searchInterval: number, cameFromMap: Map<number, number>, start: IField, finish: IField, totalFieldsAmount: number) {
    clearInterval(searchInterval)

    // only get and draw shortest path when we reached the finish
    const reachedFinish = cameFromMap.has(finish.id)
    if (reachedFinish) {

        // get path from start to finish
        const path = getShortestPath(cameFromMap, start.id, finish.id, totalFieldsAmount)

        // calculate total path step cost using the path
        calculatePathStepCost(grid, path)

        // draw path to grid
        drawShortestPath(grid, path)
    } else {
        noPathFound()
    }
}

// check if a given array contains the finish
export function arrayContainsFinish(arr: IField[]) {
    return arr.some(e => e.finish === true)
}