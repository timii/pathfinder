<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField } from "../interfaces/Field";
    import {
        currentGrid,
        isVisualizing,
        selectedAlgo,
        showStats,
    } from "../store/store";
    import AlgoSelector from "./AlgoSelector.svelte";
    import Button from "./Button.svelte";

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
                    el.searched = false;
                    el.path = false;
                    el.wall = false;
                });
            });
            currentGrid.set(grid);
        }
        showStats.set(false);
    }
</script>

<div class="flex flex-row gap-2 w-full justify-center">
    <AlgoSelector disabled={$isVisualizing} />
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
