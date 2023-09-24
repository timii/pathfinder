<script lang="ts">
    import {
        fieldsSearched,
        pathLength,
        pathStepCost,
        showNoPathFound,
        showStats,
    } from "../store/store";

    function handleClose() {
        showStats.set(false);
        showNoPathFound.set(false);
    }

    const closeIcon = "close.png";
</script>

{#if $showStats || $showNoPathFound}
    <div
        class="w-full h-full absolute left-0 top-0 backdrop-blur-sm bg-zinc-800/10 customheight:hidden"
    />
    <div
        class="bg-zinc-800 rounded-lg flex flex-col justify-center items-center p-4 gap-2 text border-black border shadow-[inset_0_2px_0_0_rgba(63,63,70,0.8)] w-64 h-60 text-zinc-200 absolute left-0 right-0 mx-auto my-auto top-0 bottom-0 customheight:relative customheight:my-0"
    >
        <div
            on:mousedown={handleClose}
            class="absolute top-3 right-3 w-6 h-6 bg-contain bg-center cursor-pointer hover:bg-zinc-700 duration-200 rounded"
            style="background-image: url({closeIcon});"
        />

        {#if $showStats}
            <div class="text-2xl border-b-2 border-[#379237] leading-[1.1]">
                Stats
            </div>
            <div class="flex flex-col items-center">
                <p>Shortest Path Length</p>
                <p>{$pathLength}</p>
                <p>Shortest Path Total Step Cost</p>
                <p>{$pathStepCost}</p>
                <p>Amount of Fields Searched</p>
                <p>{$fieldsSearched}</p>
            </div>
        {/if}

        {#if $showNoPathFound}
            <p class="text-center leading-[2]">
                <span class="text-2xl border-b-2 border-[#379237]">
                    No path between start and finish was found :(
                </span>
            </p>
            <div class="text-neutral-400 text-sm text-center">
                Try out a different arrangment of fields.
            </div>
        {/if}
    </div>
{/if}

<style lang="postcss">
</style>
