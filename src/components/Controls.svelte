<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import { currentGrid, selectedAlgo } from "../store/store";

    console.log("Controls -> selectedAlgo:", $selectedAlgo);

    function startVisualize() {
        const currentAlgo = algorithms.find((el) => el.name === $selectedAlgo);
        console.log("startVisualize -> selectedAlgo:", currentAlgo);
        if (currentAlgo && currentAlgo.functionCallback) {
            currentAlgo.functionCallback($currentGrid);
        }
    }
</script>

<div>
    <button on:click={startVisualize} class="bg-white text-black p-2"
        >Visualize</button
    >
</div>

<style lang="postcss">
</style>
