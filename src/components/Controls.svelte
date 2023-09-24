<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField, IFieldProp } from "../interfaces/Field";
    import type { ISelectItem } from "../interfaces/Select";
    import {
        currentGrid,
        isStartNodeSet,
        isFinishNodeSet,
        isVisualizing,
        selectedAlgo,
        selectedNodeType,
        showStats,
        isWeightedAlgo,
        showNoPathFound,
    } from "../store/store";
    import Button from "./Button.svelte";
    import Select from "./Select.svelte";

    function startVisualize() {
        clearGrid();

        const currentAlgo = algorithms.find((el) => el.name === $selectedAlgo);
        if (currentAlgo && currentAlgo.functionCallback) {
            currentAlgo.functionCallback($currentGrid);
        }

        isVisualizing.set(true);
    }

    function clearGrid() {
        const grid = $currentGrid;
        if (grid) {
            grid.forEach((row: IField[]) => {
                row.forEach((el: IField) => {
                    Object.keys(el).forEach((key) => {
                        if (key === "searched" || key === "path") {
                            el[key as IFieldProp] = false;
                        }
                    });
                });
            });
            currentGrid.set(grid);
        }
        showStats.set(false);
        showNoPathFound.set(false);
    }

    function isAlgoWeighted(algo: string) {
        return !(
            algo === "Breadth First Search" || algo === "Depth First Search"
        );
    }

    // map algorithms to be able to use in select
    const mappedAlgos: ISelectItem[] = algorithms.map((el) => {
        return {
            label: el.name,
            value: el.name,
            group: isAlgoWeighted(el.name) ? "Weighted" : "Unweighted",
        };
    });

    // create a function that groups the algorithms
    const groupAlgos = (item: ISelectItem) => item.group;

    // initially select first algorithm
    let algoStartValue = mappedAlgos[0];
    selectedAlgo.set(algoStartValue.label);

    function algoOnChange(event: CustomEvent) {
        const el = event.detail.label;

        // check if the selected algo uses weights for pathfinding
        isWeightedAlgo.set(isAlgoWeighted(el));

        selectedAlgo.set(el);
    }

    // array of selectable node types
    let nodeTypes: ISelectItem[] = [
        { label: "Start", value: "Start", selectable: !$isStartNodeSet },
        { label: "Finish", value: "Finish", selectable: !$isFinishNodeSet },
        { label: "Wall", value: "Wall" },
        { label: "Grass", value: "Grass" },
        { label: "Sand", value: "Sand" },
        { label: "Snow", value: "Snow" },
        { label: "Water", value: "Water" },
    ];

    console.log("nodeTypes:", nodeTypes);

    // initially select wall node type
    let nodeStartValue = nodeTypes[2];
    selectedNodeType.set(nodeStartValue.label);

    function nodeOnChange(event: CustomEvent) {
        selectedNodeType.set(event.detail.label);
    }

    function nodeOnFocus(event: CustomEvent) {
        // check if either start or finish node are already set and disable them accordingly
        nodeTypes[0] = {
            label: "Start",
            value: "Start",
            selectable: !$isStartNodeSet,
        };
        nodeTypes[1] = {
            label: "Finish",
            value: "Finish",
            selectable: !$isFinishNodeSet,
        };
    }
</script>

<div class="flex flex-wrap flex-row gap-2 w-full justify-center">
    <Select
        disabled={$isVisualizing}
        items={mappedAlgos}
        startValue={algoStartValue}
        onChangeCallback={algoOnChange}
        groupBy={groupAlgos}
    />
    <Select
        disabled={$isVisualizing}
        items={nodeTypes}
        startValue={nodeStartValue}
        onChangeCallback={nodeOnChange}
        onFocusCallback={nodeOnFocus}
        width={"150px"}
    />
    <Button
        onClickCallback={startVisualize}
        text={"Visualize"}
        disabled={$isVisualizing || !$isStartNodeSet || !$isFinishNodeSet}
    />
    <Button
        onClickCallback={clearGrid}
        text={"Clear Grid"}
        disabled={$isVisualizing}
    />
</div>

<style lang="postcss">
</style>
