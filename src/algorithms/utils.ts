import type { IField, IFieldProp } from "../interfaces/Field";
import type { IPosition, IPositionWithId } from "../interfaces/Position";
import { currentGrid, fieldsSearched, isVisualizing, pathLength, showStats } from "../store/store";

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

export function isWholeColumnEmpty(grid: IField[][], colIndex: number) {
    return grid.every(row => !row[colIndex].searched && !row[colIndex].wall)
}

// function to get the next field given a grid and two indeces
export function getNextField(grid: IField[][], firstIndex: number, secondIndex: number, rowMax: number, colMax: number, lastDirection: IPosition, beforeLastDirection: IPosition) {
    // console.log("getNextField -> grid:", grid, firstIndex, secondIndex, "rowMax/colMax:", rowMax, colMax, "prefDirection:", prefDirection, "lastDirection:", lastDirection)

    //     Steps:
    // 1. Try to get to first row -> y index schould be 0 && top right element is empty
    if (firstIndex > 0 && grid && isFieldEmtpyAndExist(grid, 0, rowMax - 1) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
        // go up 
        console.log("moving up from the start is possible")
        return { firstIndex: firstIndex - 1, secondIndex, id: grid[firstIndex - 1][secondIndex].id }
    }

    // 2. Try to get to the right -> x index should be rowMax and top right field empty
    if (firstIndex === 0 && secondIndex < rowMax - 1 && isFieldEmtpyAndExist(grid, 0, rowMax - 1) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
        console.log("moving right is possible")
        return { firstIndex, secondIndex: secondIndex + 1, id: grid[firstIndex][secondIndex + 1].id }
    }

    // if moving up and down is possible -> check beforeLastDirection to either move up or down
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
    // 3. If y index === 0 && x index === row Max 
    //     -> go down
    // 4. If x index === colMax 
    //     -> check if whole column is searched 
    //         -> if yes go left an then up
    //         -> if no go down immediately
    // 5. If x index === 0
    //     -> check if whole column is searched
    //         -> if yes go left and then down
    //         -> if no go down immediately


    // move up until we get to index zero for the y axis, 
    // if (firstIndex - 1 >= 0 && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
    //     console.log("moving up is possible")
    //     return { firstIndex: firstIndex - 1, secondIndex, id: grid[firstIndex - 1][secondIndex].id }
    // }
    // // then go to the right until we reach the max index of a row 
    // if (secondIndex + 1 <= rowMax && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
    //     console.log("moving right is possible")
    //     return { firstIndex, secondIndex: secondIndex + 1, id: grid[firstIndex][secondIndex + 1].id }
    // }
    // // and then always try to search the most right field in the row by either moving down or up

    // // if we are in the top row move down
    // if (firstIndex < colMax && lastDirection && lastDirection.firstIndex === 1) {
    //     if (firstIndex + 1 <= colMax && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 1, secondIndex: 0 }, colMax, rowMax)) {
    //         console.log("moving downwards is possible")
    //         return { firstIndex: firstIndex + 1, secondIndex, id: grid[firstIndex + 1][secondIndex].id }
    //     }
    // }

    // // if we are at the bottom row move up
    // if (firstIndex > 0 && lastDirection && lastDirection.firstIndex === -1) {
    //     if (firstIndex - 1 >= 0 && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
    //         console.log("moving upwards is possible")
    //         return { firstIndex: firstIndex - 1, secondIndex, id: grid[firstIndex - 1][secondIndex].id }
    //     }
    // }

    // // if we are in the bottom or top row, move to the left
    // if ((firstIndex === colMax - 1 || firstIndex === 0) && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: -1 }, colMax, rowMax)) {
    //     console.log("moving to the left is possible")
    //     return { firstIndex, secondIndex: secondIndex - 1, id: grid[firstIndex][secondIndex - 1].id }
    // }


    // try to return next field in the same direction as the last move
    // if (lastDirection && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, lastDirection, colMax, rowMax)) {
    //     console.log("move into same direction before is possible")
    //     const nextFirstIndex = firstIndex + lastDirection.firstIndex
    //     const nextSecondIndex = secondIndex + lastDirection.secondIndex
    //     return { firstIndex: nextFirstIndex, secondIndex: nextSecondIndex, id: grid[nextFirstIndex][nextSecondIndex].id }
    // }

    // if the search has already turned at least 3 times we first need to turn another way before turning right again
    // if (rightTurnAmount < 3) {
    //     // try to return next field in the same direction as the last move
    //     if (lastDirection && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, lastDirection, colMax, rowMax)) {
    //         console.log("move into same direction before is possible")
    //         const nextFirstIndex = firstIndex + lastDirection.firstIndex
    //         const nextSecondIndex = secondIndex + lastDirection.secondIndex
    //         return [{ firstIndex: nextFirstIndex, secondIndex: nextSecondIndex, id: grid[nextFirstIndex][nextSecondIndex].id }, false]
    //     }

    //     // if move into same direction as before is not possible try move to the right
    //     if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: 1 }, colMax, rowMax)) {
    //         console.log("moving to the right is possible")
    //         return { firstIndex, secondIndex: secondIndex + 1, id: grid[firstIndex][secondIndex + 1].id }
    //     }

    //     // if moving to the right is not possible, try to move downwards
    //     if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 1, secondIndex: 0 }, colMax, rowMax)) {
    //         console.log("moving downwards is possible")
    //         return { firstIndex: firstIndex + 1, secondIndex, id: grid[firstIndex + 1][secondIndex].id }
    //     }

    //     // if moving down is not possible, try to move to the left
    //     if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: 0, secondIndex: -1 }, colMax, rowMax)) {
    //         console.log("moving to the left is possible")
    //         return { firstIndex, secondIndex: secondIndex - 1, id: grid[firstIndex][secondIndex - 1].id }
    //     }

    //     // if moving left is not possible, try to move upwards
    //     if (isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, { firstIndex: -1, secondIndex: 0 }, colMax, rowMax)) {
    //         console.log("moving upwards is possible")
    //         return { firstIndex: firstIndex - 1, secondIndex, id: grid[firstIndex - 1][secondIndex].id }
    //     }
    // } else {
    //     // turn left/towards an empty field 
    //     if (lastDirection && isMoveInDirectionPossible(grid, { firstIndex, secondIndex }, lastDirection, colMax, rowMax)) {
    //         console.log("move into same direction before is possible")
    //         const nextFirstIndex = firstIndex + lastDirection.firstIndex
    //         const nextSecondIndex = secondIndex + lastDirection.secondIndex
    //         return { firstIndex: nextFirstIndex, secondIndex: nextSecondIndex, id: grid[nextFirstIndex][nextSecondIndex].id }
    //     }
    // }


    console.log("no move is possible")
}

// check if a move towards a given direction is possible
export function isMoveInDirectionPossible(grid: IField[][], curPosition: IPosition, direction: IPosition, colMax: number, rowMax: number) {
    const newFirstIndex = curPosition.firstIndex + direction.firstIndex
    const newSecondIndex = curPosition.secondIndex + direction.secondIndex
    return newFirstIndex < colMax && newFirstIndex >= 0 && newSecondIndex < rowMax && newSecondIndex >= 0 && isFieldEmtpyAndExist(grid, newFirstIndex, newSecondIndex)
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
        }, 250)
    }
}

// function to calculate the last direction moved by using two given fields
export function calculateLastDirection(lastField: IPosition, currentField: IPosition) {
    const beforeLastYDirection = lastField.firstIndex - currentField.firstIndex
    const beforeLastXDirection = lastField.secondIndex - currentField.secondIndex
    return { firstIndex: beforeLastYDirection, secondIndex: beforeLastXDirection }
}
