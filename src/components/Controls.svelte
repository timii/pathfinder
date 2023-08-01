<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField } from "../interfaces/Field";
    import { currentGrid, selectedAlgo } from "../store/store";

    console.log("Controls -> selectedAlgo:", $selectedAlgo);

    function startVisualize() {
        const currentAlgo = algorithms.find((el) => el.name === $selectedAlgo);
        console.log("startVisualize -> selectedAlgo:", currentAlgo);
        if (currentAlgo && currentAlgo.functionCallback) {
            currentAlgo.functionCallback($currentGrid);
        }
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

<div>
    <button on:click={startVisualize} class="bg-white text-black p-2"
        >Visualize</button
    >
    <button on:click={clearGrid} class="bg-white text-black p-2"
        >Clear Grid</button
    >
</div>

<style lang="postcss">
</style>
