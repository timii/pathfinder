<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IAlgorithm } from "../interfaces/Algorithm";
    import { selectedAlgo } from "../store/store";

    let selected: IAlgorithm;

    function onChange(event: Event) {
        // selected = (event.target as HTMLInputElement).value;
        console.log("onChange called -> event:", event, "selected:", selected);
        selectedAlgo.set(selected.name);
    }
</script>

<div>
    <select class="text-black" bind:value={selected} on:change={onChange}>
        {#each algorithms as algo}
            <option value={algo}>
                {algo.name}
            </option>
        {/each}
    </select>
    <p>Current node type: {$selectedAlgo}</p>
</div>

<style lang="postcss">
</style>
