<script lang="ts">
    import { getRandomInt } from "../utils/utils";
    import type { IField } from "../interfaces/Field";
    import { currentGrid } from "../store/store";
    import Field from "./Field.svelte";
    import Stats from "./Stats.svelte";
    import { CONSTS } from "../utils/consts";

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

    fields[7][1] = { ...fields[7][1], start: true };
    fields[3][8] = { ...fields[3][8], finish: true };

    // set a fixed start and finsish field
    // fields[2][2] = { ...fields[2][2], start: true };
    // fields[8][1] = { ...fields[8][1], start: true };
    // fields[8][8] = { ...fields[8][8], finish: true };
    // fields[4][6] = { ...fields[4][6], finish: true };
    // fields[1][1] = { ...fields[1][1], searched: true };
    // fields[7][0] = { ...fields[7][0], path: true };

    // fields[5][5] = { ...fields[5][5], grass: true, weight: 5 };
    // fields[6][5] = { ...fields[6][5], grass: true, weight: 5 };
    // fields[4][5] = { ...fields[4][5], grass: true, weight: 5 };
    // fields[3][5] = { ...fields[3][5], grass: true, weight: 5 };

    // fields[5][4] = { ...fields[5][4], snow: true, weight: 5 };
    // fields[6][4] = { ...fields[6][4], snow: true, weight: 5 };
    // fields[4][4] = { ...fields[4][4], snow: true, weight: 5 };
    // fields[3][4] = { ...fields[3][4], snow: true, weight: 5 };

    // fields[5][3] = { ...fields[5][3], sand: true, weight: 5 };
    // fields[6][3] = { ...fields[6][3], sand: true, weight: 5 };
    // fields[4][3] = { ...fields[4][3], sand: true, weight: 5 };
    // fields[3][3] = { ...fields[3][3], sand: true, weight: 5 };

    // fields[5][2] = { ...fields[5][2], water: true, weight: 5 };
    // fields[6][2] = { ...fields[6][2], water: true, weight: 5 };
    // fields[4][2] = { ...fields[4][2], water: true, weight: 5 };
    // fields[3][2] = { ...fields[3][2], water: true, weight: 5 };

    // fields[7][5] = { ...fields[7][5], grass: true, weight: 5 };
    // fields[7][4] = { ...fields[7][4], grass: true, weight: 5 };
    // fields[6][4] = { ...fields[6][4], grass: true, weight: 5 };
    // fields[5][4] = { ...fields[5][4], grass: true, weight: 5 };
    // fields[4][4] = { ...fields[4][4], grass: true, weight: 5 };

    // fields[5][5] = { ...fields[5][5], wall: true };
    // fields[6][5] = { ...fields[6][5], wall: true };
    // fields[4][5] = { ...fields[4][5], wall: true };

    // fields[4][6] = { ...fields[4][6], wall: true };
    // fields[6][6] = { ...fields[6][6], wall: true };
    // fields[5][6] = { ...fields[5][6], wall: true };

    // fields[6][4] = { ...fields[6][4], wall: true };
    // fields[5][4] = { ...fields[5][4], wall: true };
    // fields[4][4] = { ...fields[4][4], wall: true };

    // fields[5][3] = { ...fields[5][3], grass: true, weight: 5 };
    // fields[6][3] = { ...fields[6][3], grass: true, weight: 5 };
    // fields[4][3] = { ...fields[4][3], grass: true, weight: 5 };
    // fields[7][3] = { ...fields[7][3], grass: true, weight: 5 };

    currentGrid.set(fields);

    // keep track of the current height to move the stats window according to the screen height
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
    {#if curHeight < CONSTS.statsMinHeight}
        <Stats />
    {/if}
</div>
{#if curHeight >= CONSTS.statsMinHeight}
    <Stats />
{/if}

<style lang="postcss">
</style>
