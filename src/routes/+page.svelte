<script lang="ts">
    import Controls from "../components/Controls.svelte";
    import Grid from "../components/Grid.svelte";
    import Headline from "../components/Headline.svelte";
    import Stats from "../components/Stats.svelte";

    // array of all image urls
    $: preloadImageUrls = [
        "close.png",
        "goal.png",
        "grass.png",
        "sand.png",
        "snow.png",
        "start.png",
        "wall.png",
        "water.png",
    ];
</script>

<!-- insert a link for eac image into the head and preload it as soon as the site loads -->
<svelte:head>
    {#each preloadImageUrls as image}
        <link rel="preload" as="image" href={image} />
    {/each}
</svelte:head>

<main
    class="flex flex-col items-center text-zinc-100 bg-zinc-900 h-full font-sans font-lg font-semibold p-6"
>
    <Headline />

    <Controls />

    <Grid />

    <!-- <Stats /> -->
</main>

<style lang="postcss">
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
</style>
