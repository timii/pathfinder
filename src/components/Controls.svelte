<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField } from "../interfaces/Field";
    import { currentGrid, isVisualizing, selectedAlgo } from "../store/store";
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
    }
</script>

<div class="flex flex-row gap-2">
    <Button onClickCallback={startVisualize} text={"Visualize"} />
    <Button onClickCallback={clearGrid} text={"Clear Grid"} />
</div>

<style lang="postcss">
</style>
