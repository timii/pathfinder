import type { IField } from "../interfaces/Field";
import type { IPositionWithId, IPositionWithIdAndPrio } from "../interfaces/Position";
import { currentGrid, isVisualizing } from "../store/store";
import { drawShortestPath, getAllAdjacentFieldPositions, getFieldPositionByProp, getShortestPath, isEveryFieldSearched, isFieldEmtpyAndExist } from "./utils";

export function dijkstra(grid: IField[][]) {
    console.log("dijkstra called -> grid:", grid)

    const startNode = getFieldPositionByProp(grid, "start")
    const finishNode = getFieldPositionByProp(grid, "finish")
    // map to keep track of where we came from (key: next field, value: current field)
    let cameFromMap = new Map<number, number>()

    if (startNode && finishNode) {
        // map to keep track of the cost of movements so far (key: next field, value: prio)
        let costSoFarMap = new Map<number, number>([[startNode.id, 0]])
        let fieldsToCheck: IPositionWithIdAndPrio[] = [{ ...startNode, prio: 0 }]
        let fieldsToCheckWithoutStartAndFinish: IPositionWithIdAndPrio[] = []
        let neighbours: IPositionWithIdAndPrio[] = []
        // let i = 0

        const searchInterval = setInterval(() => {
            console.log("in while -> fieldsToCheck:", fieldsToCheck, "neighbours:", neighbours, "cameFromMap:", cameFromMap)
            if (fieldsToCheck.length > 0) {

                // get all the adjacent fields of each field that we have to check
                fieldsToCheck.forEach(field => {

                    // map each neighbour to also include the prio
                    const newNeighbours = [...getAllAdjacentFieldPositions(grid, field.firstIndex, field.secondIndex)].map(el => { return { ...el, prio: 0 } as IPositionWithIdAndPrio })

                    neighbours.push(...newNeighbours)
                    neighbours.forEach(el => {
                        if (!cameFromMap.has(el.id)) {
                            cameFromMap.set(el.id, field.id)
                        }
                    })
                    // console.log("in for each -> field:", field, "neighbours:", neighbours)
                })

                // const neighbours = getAllAdjacentFieldPositions(grid, startNode.firstIndex, startNode.secondIndex)
                console.log("bfs function called -> startNode:", startNode, "finishNode:", finishNode, "neighbours:", neighbours, "cameFromMap:", cameFromMap);

                if (neighbours.length > 0) {
                    fieldsToCheck = []

                    // new fields to check are the neighbours from the field that we checked before
                    fieldsToCheck = [...neighbours]

                    // create a second array with all neighbours in it, but filter every field out that isn't empty
                    fieldsToCheckWithoutStartAndFinish = neighbours.filter((el => isFieldEmtpyAndExist(grid, el.firstIndex, el.secondIndex, true)))

                    neighbours.forEach(field => {
                        const element = grid[field.firstIndex][field.secondIndex]
                        if (!element.start && !element.finish) {
                            element.searched = true
                        }
                    })
                    neighbours = []
                }
                currentGrid.set(grid)

                // console.log("end of interval -> isEveryFieldSearched(grid):", isEveryFieldSearched(grid), " cameFromMap.has(finishNode.id):", cameFromMap.has(finishNode.id), "fieldsToCheckWithoutStartAndFinish.length === 0:", fieldsToCheckWithoutStartAndFinish.length === 0, fieldsToCheckWithoutStartAndFinish)

                // stop checking for fields if every field is not empty or a path to the finish field has been found
                if (isEveryFieldSearched(grid) || cameFromMap.has(finishNode.id) || fieldsToCheckWithoutStartAndFinish.length === 0) {
                    clearInterval(searchInterval)

                    // get path from start to finish
                    const path = getShortestPath(cameFromMap, startNode.id, finishNode.id)

                    // draw path to grid
                    drawShortestPath(grid, path)
                }
            }
        }, 250)
    }


    isVisualizing.set(false)
}

