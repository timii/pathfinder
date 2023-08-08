<script lang="ts">
    import AlgoSelector from "../components/AlgoSelector.svelte";
    import Controls from "../components/Controls.svelte";
    import Grid from "../components/Grid.svelte";
    import Headline from "../components/Headline.svelte";
    import NodeSelector from "../components/NodeSelector.svelte";
    import Stats from "../components/Stats.svelte";
    import { selectedAlgo } from "../store/store";
</script>

<main
    class="flex flex-col items-center text-zinc-100 bg-zinc-900 h-full font-sans font-lg font-semibold gap-2 p-4"
>
    <Headline />

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
