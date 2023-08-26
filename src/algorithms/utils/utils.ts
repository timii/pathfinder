import type { IField, IFieldProp } from "../../interfaces/Field";
import type { IPosition, IPositionWithId, IPositionWithIdAndWeight } from "../../interfaces/Position";
import { currentGrid, fieldsSearched, isVisualizing, pathLength, showStats } from "../../store/store";

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

// function to return the field using its prop name
export function getFieldByProp(grid: IField[][], property: IFieldProp): IField | undefined {
    // console.log("getFieldPosition -> grid:", grid)
    for (var i = 0; i < grid.length; i++) {
        var field = grid[i].find(field => field[property] === true);
        if (field) {
            return field
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
    let neighbourIndeces: number[][] = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]]

    neighbourIndeces.forEach(([nX, nY]) => {
        // console.log("getAllAdjacentFields in for each -> nx:", nX, "nY:", nY)
        if (isMoveToFieldPossible(grid, { firstIndex: nY, secondIndex: nX })) {
            neighbours.push(grid[nY][nX])
        }
    })
    // console.log("getAllAdjacentFields -> neighbours:", neighbours)
    return neighbours || []
}

// function to get all adjacent empty field positions to a given position which will only be added if they don't already exist in `arrayToCheck`
export function getAllAdjacentFieldPositions(grid: IField[][], firstIndex: number, secondIndex: number, arrayToCheck: IPositionWithId[] | IPositionWithIdAndWeight[]) {
    const neighbours: IPositionWithId[] = []
    const rowMax = grid[0].length
    const colMax = grid.length
    // console.log("getAllAdjacentFieldPositions -> grid:", grid, firstIndex, secondIndex, "rowMax:", rowMax, "colMax:", colMax)

    // check field above
    const fieldAbove = [firstIndex - 1, secondIndex]
    if (firstIndex - 1 >= 0 && isFieldEmtpyAndExist(grid, fieldAbove[0], fieldAbove[1]) && !doesFieldExistInArray(arrayToCheck, grid[fieldAbove[0]][fieldAbove[1]].id)) {
        const elementAbove = grid[fieldAbove[0]][fieldAbove[1]]
        neighbours.push({ firstIndex: fieldAbove[0], secondIndex: fieldAbove[1], id: elementAbove.id })
    }

    // check field below
    const fieldBelow = [firstIndex + 1, secondIndex]
    if (firstIndex + 1 < colMax && isFieldEmtpyAndExist(grid, fieldBelow[0], fieldBelow[1]) && !doesFieldExistInArray(arrayToCheck, grid[fieldBelow[0]][fieldBelow[1]].id)) {
        const elementBelow = grid[fieldBelow[0]][fieldBelow[1]]
        neighbours.push({ firstIndex: fieldBelow[0], secondIndex: fieldBelow[1], id: elementBelow.id })
    }

    // check field to the left
    const fieldToTheLeft = [firstIndex, secondIndex - 1]
    if (secondIndex - 1 >= 0 && isFieldEmtpyAndExist(grid, fieldToTheLeft[0], fieldToTheLeft[1]) && !doesFieldExistInArray(arrayToCheck, grid[fieldToTheLeft[0]][fieldToTheLeft[1]].id)) {
        const elementToTheLeft = grid[fieldToTheLeft[0]][fieldToTheLeft[1]]
        neighbours.push({ firstIndex: fieldToTheLeft[0], secondIndex: fieldToTheLeft[1], id: elementToTheLeft.id })
    }

    // check field to the right
    const fieldToTheRight = [firstIndex, secondIndex + 1]
    if (secondIndex + 1 < rowMax && isFieldEmtpyAndExist(grid, fieldToTheRight[0], fieldToTheRight[1]) && !doesFieldExistInArray(arrayToCheck, grid[fieldToTheRight[0]][fieldToTheRight[1]].id)) {
        const elementToTheRight = grid[fieldToTheRight[0]][fieldToTheRight[1]]
        neighbours.push({ firstIndex: fieldToTheRight[0], secondIndex: fieldToTheRight[1], id: elementToTheRight.id })
    }

    console.log("getAllAdjacentFieldPositions -> neighbours:", neighbours)
    return neighbours
}

// function to check if a field, using its id, already exists in a given array
export function doesFieldExistInArray(arrayToCheck: IPositionWithId[] | IPositionWithIdAndWeight[], id: number): boolean {
    return arrayToCheck.findIndex(el => el.id === id) !== -1
}

// function to check if a field at given indeces exists and if it's empty 
export function isFieldEmtpyAndExist(grid: IField[][], firstIndex: number, secondIndex: number, includeStartAndFinish?: boolean, includeOnlyStart?: boolean) {
    const field = grid[firstIndex][secondIndex]
    // console.log("isFieldEmtpyAndExist -> el:", field, firstIndex, secondIndex)
    if (field) {
        // console.log("field.searched || field.start || field.finish || field.path:", field.searched || field.start || field.finish || field.path)
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

// function to check if every field is either searched or either a start, finish or wall field
export function isEveryFieldSearched(grid: IField[][]) {
    return grid.every((row, i) => row.every((_, j) => !isFieldEmtpyAndExist(grid, i, j)))
}

// function to get the next field given a grid and two indeces
export function getNextField(grid: IField[][], firstIndex: number, secondIndex: number, rowMax: number, colMax: number, lastDirection: IPosition) {

    // try to get to first row -> y index schould be 0 && top right element is empty
    if (firstIndex > 0 && grid && isFieldEmtpyAndExist(grid, 0, rowMax - 1) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
        // go up 
        console.log("moving up from the start is possible")
        return { firstIndex: firstIndex - 1, secondIndex, id: grid[firstIndex - 1][secondIndex].id }
    }

    // try to get to the right -> x index should be rowMax and top right field empty
    if (firstIndex === 0 && secondIndex < rowMax - 1 && isFieldEmtpyAndExist(grid, 0, rowMax - 1) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
        console.log("moving right is possible")
        return { firstIndex, secondIndex: secondIndex + 1, id: grid[firstIndex][secondIndex + 1].id }
    }

    // if moving up and down is possible -> check direction to either move up or down
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 1, secondIndex: 0 }, colMax, rowMax) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax) && lastDirection) {
        console.log("moving up and down is possible, check lastDirection:", lastDirection)
        const newFirstIndex = firstIndex + lastDirection.firstIndex
        const newSecondIndex = secondIndex + lastDirection.secondIndex
        return { firstIndex: newFirstIndex, secondIndex: newSecondIndex, id: grid[newFirstIndex][newSecondIndex].id }
    }

    // move right if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
        console.log("moving right is possible")
        return { firstIndex, secondIndex: secondIndex + 1, id: grid[firstIndex][secondIndex + 1].id }
    }

    // move down if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 1, secondIndex: 0 }, colMax, rowMax)) {
        console.log("moving down is possible")
        return { firstIndex: firstIndex + 1, secondIndex, id: grid[firstIndex + 1][secondIndex].id }
    }

    // move up if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
        console.log("moving up is possible")
        return { firstIndex: firstIndex - 1, secondIndex, id: grid[firstIndex - 1][secondIndex].id }
    }

    // move left if possible
    if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: -1 }, colMax, rowMax)) {
        console.log("moving to the left is possible")
        return { firstIndex, secondIndex: secondIndex - 1, id: grid[firstIndex][secondIndex - 1].id }
    }
}

// check if a move towards a given direction is possible
export function isMoveInDirectionPossible(grid: IField[][], curPosition: IPosition, direction: IPosition, colMax: number, rowMax: number) {
    const newFirstIndex = curPosition.firstIndex + direction.firstIndex
    const newSecondIndex = curPosition.secondIndex + direction.secondIndex
    return newFirstIndex < colMax && newFirstIndex >= 0 && newSecondIndex < rowMax && newSecondIndex >= 0 && isFieldEmtpyAndExist(grid, newFirstIndex, newSecondIndex, false, true)
}

export function isMoveToFieldPossible(grid: IField[][], neighbourIndeces: IPosition) {
    const rowMax = grid[0].length
    const colMax = grid.length

    // console.log("isMoveToFieldPossible -> neighbourIndeces:", neighbourIndeces)

    return neighbourIndeces.firstIndex < colMax && neighbourIndeces.firstIndex >= 0 && neighbourIndeces.secondIndex < rowMax && neighbourIndeces.secondIndex >= 0 && isFieldEmtpyAndExist(grid, neighbourIndeces.firstIndex, neighbourIndeces.secondIndex, false, true)
}

// function to get the shortest path using a given map of ids
export function getShortestPath(cameFromMap: Map<number, number>, startId: number, finishId: number, amountOfFields: number) {
    let current = finishId
    console.log("before while -> current:", current, "cameFromMap:", cameFromMap, "amountOfFields:", amountOfFields)
    let path: number[] = []
    while (current !== startId && path.length < amountOfFields) {
        path.push(current)
        console.log("in while -> path:", path, "cameFromMap.get(current):", cameFromMap.get(current))
        if (cameFromMap.has(current)) {
            current = cameFromMap.get(current)!
        }
    }
    path.push(startId)

    // set pathLength for stats (-2 because we exclude start and finish field)
    pathLength.set(path.length - 2)

    return path
}

export function drawShortestPath(grid: IField[][], path: number[]) {
    // set fieldSearched for stats
    let fieldsSearchedAmount = 0
    grid.forEach(row => row.forEach(field => {
        if (field.searched) { fieldsSearchedAmount++ }
    }))
    fieldsSearched.set(fieldsSearchedAmount)

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
                    showStats.set(true)
                }
            } else {
                isVisualizing.set(false)
                console.log("clear path interval")
                clearInterval(pathInterval)
                showStats.set(true)
            }
            currentGrid.set(grid)
        }, 50)
    }
}

// function to calculate the last direction moved by using two given fields
export function calculateLastDirection(lastField: IPosition, currentField: IPosition) {
    const beforeLastYDirection = lastField.firstIndex - currentField.firstIndex
    const beforeLastXDirection = lastField.secondIndex - currentField.secondIndex
    return { firstIndex: beforeLastYDirection, secondIndex: beforeLastXDirection }
}

// function to get the lowest step cost from a given array of fields
export function getLowestCost(fields: IPositionWithIdAndWeight[]) {
    console.log("getLowestCost -> fields:", fields)
    if (fields.length > 0) {
        const minField = fields.reduce((a, b) => a.weight < b.weight ? a : b)
        return minField.weight || 1
    } else {
        return 0
    }
}

// function to divide a given array into two seperate ones using a given filter
export function partitionArray(array: IPositionWithIdAndWeight[], filter: (el: IPositionWithIdAndWeight) => boolean) {
    const pass: typeof array = []
    const fail: typeof array = []

    array.forEach(el => {
        if (filter(el))
            pass.push(el);
        else
            fail.push(el);
    })

    console.log("partitionArray -> pass:", pass, "fail:", fail)
    return [pass, fail];
}
