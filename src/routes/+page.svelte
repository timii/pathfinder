<script lang="ts">
    import AlgoSelector from "../components/AlgoSelector.svelte";
    import Controls from "../components/Controls.svelte";
    import Grid from "../components/Grid.svelte";
    import NodeSelector from "../components/NodeSelector.svelte";
    import Stats from "../components/Stats.svelte";
    import { selectedAlgo } from "../store/store";
</script>

<main
    class="flex flex-col items-center text-white bg-zinc-900 h-screen font-sans font-lg font-semibold gap-2"
>
    <Grid />

    <p>Current node type: {$selectedAlgo}</p>

    <!-- <AlgoSelector /> -->
    <!-- <NodeSelector /> -->

    <Controls />

    <Stats />
</main>

<style lang="postcss">
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
</style>
