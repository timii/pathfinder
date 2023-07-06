<script lang="ts">
    import AlgoSelector from "../components/AlgoSelector.svelte";
    import Grid from "../components/Grid.svelte";
    import NodeSelector from "../components/NodeSelector.svelte";
</script>

<main
    class="flex flex-col items-center text-white bg-zinc-900 h-screen font-sans font-lg font-semibold"
>
    <Grid />

    <AlgoSelector />
    <!-- <NodeSelector /> -->
</main>

<style lang="postcss">
</style>
