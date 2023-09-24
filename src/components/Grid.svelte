<script lang="ts">
    import { getRandomInt } from "../utils/utils";
    import type { IField } from "../interfaces/Field";
    import { currentGrid } from "../store/store";
    import Field from "./Field.svelte";
    import { CONSTS } from "../utils/consts";
    import InfoBox from "./InfoBox.svelte";

    const fieldObject: IField = {
        id: 0,
        weight: 1,
        start: false,
        finish: false,
        wall: false,
        searched: false,
        path: false,
        grass: false,
        snow: false,
        sand: false,
        water: false,
        x: 0,
        y: 0,
    };
    const rows = 10;
    const cols = 10;

    // workaround to manually add all fields without objects being the same reference
    // creates 2d array of fields with cols * rows amount of elements
    let fields: IField[][] = [];
    for (let i = 0; i < rows; i++) {
        fields[i] = [];
        for (let j = 0; j < cols; j++) {
            fields[i][j] = JSON.parse(
                JSON.stringify({
                    ...fieldObject,
                    id: getRandomInt(1, 999999),
                    y: i,
                    x: j,
                } as IField)
            );
        }
    }

    // set a default start and finish block at start load
    fields[7][1] = { ...fields[7][1], start: true };
    fields[3][8] = { ...fields[3][8], finish: true };

    // refresh the grid with the added start and finish in the store
    currentGrid.set(fields);

    // keep track of the current height to move the info box window according to the screen height
    let curHeight = 0;
</script>

<!-- bind curHeight to the innerHeight of the window -->
<svelte:window bind:innerHeight={curHeight} />

<div
    class="bg-zinc-800 p-[2px] rounded-lg bg-gradient-to-t from-transparent via-[#379237] to-transparent shadow-[0_0_5px_1px_rgba(63,63,70,0.8)] shadow-slate-600 m-6 relative"
>
    <div class="bg-zinc-800 p-4">
        <div class="flex flex-col gap-1">
            {#each $currentGrid as row, i}
                <div class="flex flex-row gap-1">
                    {#each row as col, j}
                        <Field fieldData={col} />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
    {#if curHeight < CONSTS.infoBoxMinHeight}
        <InfoBox />
    {/if}
</div>
{#if curHeight >= CONSTS.infoBoxMinHeight}
    <InfoBox />
{/if}

<style lang="postcss">
</style>
