<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField, IFieldProp } from "../interfaces/Field";
    import type { ISelectItem } from "../interfaces/Select";
    import {
        currentGrid,
        isVisualizing,
        selectedAlgo,
        selectedNodeType,
        showStats,
    } from "../store/store";
    import Button from "./Button.svelte";
    import Select from "./Select.svelte";

    function startVisualize() {
        const currentAlgo = algorithms.find((el) => el.name === $selectedAlgo);
        console.log("startVisualize -> selectedAlgo:", currentAlgo);
        if (currentAlgo && currentAlgo.functionCallback) {
            currentAlgo.functionCallback($currentGrid);
        }
        isVisualizing.set(true);
    }

    function clearGrid() {
        console.log("clearGrid called");
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
    }

    // map algorithms to be able to use in select
    const mappedAlgos: ISelectItem[] = algorithms.map((el) => {
        return { label: el.name, value: el.name };
    });

    // initially select first algorithm
    // TODO: add check later if algorithm is already set in localStorage
    // TODO: reset to first element
    let algoStartValue: { label: string; value: string } = mappedAlgos[0];
    selectedAlgo.set(algoStartValue.label);

    function algoOnChange(event: CustomEvent) {
        console.log(
            "algoOnChange called -> event:",
            event,
            "selected:",
            event.detail.label
        );
        selectedAlgo.set(event.detail.label);
    }

    // array of selectable node types
    // TODO: add start and finish later on
    const nodeTypes: ISelectItem[] = [
        { label: "Wall", value: "Wall" },
        { label: "Grass", value: "Grass" },
        { label: "Sand", value: "Sand" },
        { label: "Snow", value: "Snow" },
        { label: "Water", value: "Water" },
    ];

    // initially select wall as node type
    // TODO: add check later if node type is already set in localStorage
    let nodeStartValue = nodeTypes[0];
    selectedNodeType.set(nodeStartValue.label);

    function nodeOnChange(event: CustomEvent) {
        console.log(
            "nodeOnChange called -> event:",
            event,
            "selected:",
            event.detail.label
        );
        selectedNodeType.set(event.detail.label);
    }
</script>

<div class="flex flex-row gap-2 w-full justify-center">
    <Select
        disabled={$isVisualizing}
        items={mappedAlgos}
        startValue={algoStartValue}
        onChangeCallback={algoOnChange}
    />
    <Select
        disabled={$isVisualizing}
        items={nodeTypes}
        startValue={nodeStartValue}
        onChangeCallback={nodeOnChange}
        width={"150px"}
    />
    <Button
        onClickCallback={startVisualize}
        text={"Visualize"}
        disabled={$isVisualizing}
    />
    <Button
        onClickCallback={clearGrid}
        text={"Clear Grid"}
        disabled={$isVisualizing}
    />
</div>

<style lang="postcss">
</style>
