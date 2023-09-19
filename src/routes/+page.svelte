<script lang="ts">
    import Controls from "../components/Controls.svelte";
    import Grid from "../components/Grid.svelte";
    import Headline from "../components/Headline.svelte";
    import Stats from "../components/Stats.svelte";
</script>

<main
    class="flex flex-col items-center text-zinc-100 bg-zinc-900 h-full font-sans font-lg font-semibold p-6"
>
    <Headline />

    <Controls />

    <Grid />

    <Stats />
</main>

<style lang="postcss">
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
</style>
