<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField } from "../interfaces/Field";
    import { currentGrid, isVisualizing, selectedAlgo } from "../store/store";

    // console.log("Controls -> selectedAlgo:", $selectedAlgo);

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

    // button background: #21242c rgb(33, 36, 44)
    // button text: #d6dbe5 rgb(214, 219, 229)

    const buttonStyles =
        "bg-zinc-800 text-zinc-200 rounded-lg leading-none p-2.5 pb-3 shadow-[inset_0_2px_0_0_rgba(63,63,70,0.8)] border-black border disabled:text-opacity-50 disabled:bg-opacity-50 hover:bg-[#313135] active:bg-zinc-800 duration-100 ease-in-out disabled:pointer-events-none";
</script>

<div class="flex flex-row gap-2">
    <button
        on:click={startVisualize}
        disabled={$isVisualizing}
        class={buttonStyles}>Visualize</button
    >
    <button on:click={clearGrid} disabled={$isVisualizing} class={buttonStyles}
        >Clear Grid</button
    >
</div>

<style lang="postcss">
</style>
