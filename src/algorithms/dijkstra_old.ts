import type { IField } from "../interfaces/Field";
import type { IPositionWithId, IPositionWithIdAndWeight } from "../interfaces/Position";
import { currentGrid, isVisualizing } from "../store/store";
import { doesFieldExistInArray, drawShortestPath, getAllAdjacentFieldPositions, getFieldPositionByProp, getLowestCost, getShortestPath, isEveryFieldSearched, isFieldEmtpyAndExist, partitionArray } from "./utils/utils";

export function dijkstra(grid: IField[][]) {
    console.log("dijkstra called -> grid:", grid)
    const rowMax = grid[0].length
    const colMax = grid.length
    const startNode = getFieldPositionByProp(grid, "start")
    const finishNode = getFieldPositionByProp(grid, "finish")
    // map to keep track of where we came from (key: next field, value: current field)
    let cameFromMap = new Map<number, number>()

    if (startNode && finishNode) {
        // map to keep track of the cost of movements so far (key: next field, value: prio)
        let costSoFarMap = new Map<number, number>([[startNode.id, 0]])
        let fieldsToCheck: IPositionWithIdAndWeight[] = [{ ...startNode, weight: 0 }]
        let fieldsToCheckWithBiggerWeights: IPositionWithIdAndWeight[] = []
        let fieldsToCheckWithoutStartAndFinish: IPositionWithIdAndWeight[] = []
        let neighbours: IPositionWithIdAndWeight[] = []
        let lastCost = 0
        let lowestCost = 0
        let i = 0

        const searchInterval = setInterval(() => {
            console.log("in while -> fieldsToCheck:", fieldsToCheck, "neighbours:", neighbours, "cameFromMap:", cameFromMap)
            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach((field, j) => {
                    // map each neighbour to also include the weight
                    const newNeighbours = [...getAllAdjacentFieldPositions(grid, field.firstIndex, field.secondIndex, neighbours)]
                        .map((el) => {
                            // console.log("in map -> el:", el, grid[el.firstIndex][el.secondIndex], grid[el.firstIndex][el.secondIndex].weight)
                            const currentField = grid[el.firstIndex][el.secondIndex]
                            let stepCost = currentField.weight
                            // let prio = 0
                            // if (currentField.grass) {
                            // prio = 5
                            // }

                            console.log("currentField:", currentField, "stepCost:", stepCost)
                            // console.log("currentField:", currentField, "costSoFarMap.get(field.id):", costSoFarMap.get(field.id), "costSoFarMap.get(el.id):", costSoFarMap.get(el.id), "stepCost:", stepCost)
                            const newCost = (costSoFarMap.get(field.id) || 0) + stepCost
                            if (!costSoFarMap.has(el.id) || newCost < (costSoFarMap.get(el.id) || 0)) {
                                // prio = newCost
                                costSoFarMap.set(el.id, newCost)
                            }

                            // console.log("prio:", prio)
                            return { ...el, weight: stepCost } as IPositionWithIdAndWeight
                        })

                    console.log("newNeighbours:", newNeighbours)

                    if (j === 0) {
                        lastCost = lowestCost
                        lowestCost += getLowestCost(newNeighbours)
                    }

                    // divide neighbours into two arrays with one having the lowest weighted neighbours and the other array containing higher weighted neighbours
                    let [lowestCostNeighbours, higherCostNeighbours] = partitionArray(newNeighbours, (el) => el.weight + lastCost <= lowestCost && isFieldEmtpyAndExist(grid, el.firstIndex, el.secondIndex, true))
                    // const lowestCostNeighbours = newNeighbours.filter((el) => el.weight + lastCost <= lowestCost && isFieldEmtpyAndExist(grid, el.firstIndex, el.secondIndex, true))

                    // filter out fields that are already in the array 
                    higherCostNeighbours = higherCostNeighbours.filter(el => !doesFieldExistInArray(fieldsToCheckWithBiggerWeights, el.id) && isFieldEmtpyAndExist(grid, el.firstIndex, el.secondIndex, true))
                    // add neighbours with bigger weights, than the field with the smallest weight, into a seperate array
                    fieldsToCheckWithBiggerWeights.push(...higherCostNeighbours)

                    console.log("lowestCostNeighbours:", lowestCostNeighbours, "fieldsToCheckWithBiggerWeights:", fieldsToCheckWithBiggerWeights)

                    neighbours.push(...lowestCostNeighbours)
                    neighbours.forEach(el => {
                        if (!cameFromMap.has(el.id)) {
                            cameFromMap.set(el.id, field.id)
                        }
                    })
                })

                // const neighbours = getAllAdjacentFieldPositions(grid, startNode.firstIndex, startNode.secondIndex)
                console.log("dijkstra function called -> startNode:", startNode, "finishNode:", finishNode, "neighbours:", neighbours, "cameFromMap:", cameFromMap);

                if (neighbours.length > 0) {
                    fieldsToCheck = []

                    const removeFieldsIndeces: number[] = []
                    // check if any of the neighbours with bigger weights are also searchable now by checking if their weight + lastCost is not bigger than lowestCost
                    console.log("check fields with bigger weights:", fieldsToCheckWithBiggerWeights)
                    fieldsToCheckWithBiggerWeights.forEach((el, k) => {
                        console.log("field with bigger weight:", el)
                        if (el.weight + lastCost <= lowestCost) {
                            const element = grid[el.firstIndex][el.secondIndex]
                            removeFieldsIndeces.push(k)
                            if (!element.start && !element.finish) {
                                element.searched = true
                            }
                        }
                    })

                    // iterate backwards through array to remove searched fields with heavier weights afterwards
                    for (let k = removeFieldsIndeces.length - 1; k >= 0; k--) {
                        fieldsToCheckWithBiggerWeights.splice(removeFieldsIndeces[k], 1)
                    }

                    // new fields to check are the neighbours from the field that we checked before
                    fieldsToCheck = [...neighbours]

                    // create a second array with all neighbours in it, but filter every field out that isn't empty
                    fieldsToCheckWithoutStartAndFinish = neighbours.filter((el => isFieldEmtpyAndExist(grid, el.firstIndex, el.secondIndex, true)))

                    // mark each neighbour as searched 
                    neighbours.forEach(field => {
                        const element = grid[field.firstIndex][field.secondIndex]
                        if (!element.start && !element.finish) {
                            element.searched = true
                            // element.grass = false
                        }
                    })
                    neighbours = []
                }
                currentGrid.set(grid)
                i++

                // stop checking for fields if every field is not empty or a path to the finish field has been found
                if (i === 7 || isEveryFieldSearched(grid) || cameFromMap.has(finishNode.id) || fieldsToCheckWithoutStartAndFinish.length === 0) {
                    clearInterval(searchInterval)

                    // get path from start to finish
                    // const path = getShortestPath(cameFromMap, startNode.id, finishNode.id, colMax * rowMax)

                    // draw path to grid
                    // drawShortestPath(grid, path)
                }
            }
        }, 50)
    }

    isVisualizing.set(false)
}

