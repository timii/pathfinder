<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import { getRandomInt } from "../algorithms/utils/utils";
    import type { IField } from "../interfaces/Field";
    import { currentGrid } from "../store/store";
    import Field from "./Field.svelte";

    // if (algorithms[0].functionCallback) {
    //     console.log(
    //         "algorithms:",
    //         algorithms
    //         // algorithms[0].functionCallback()
    //     );
    // } else {
    //     console.log("algorithms:", algorithms);
    // }

    const fieldObject: IField = {
        id: 0,
        weight: 1,
        start: false,
        finish: false,
        wall: false,
        searched: false,
        path: false,
        grass: false,
        x: 0,
        y: 0,
    };
    const rows = 10;
    const cols = 10;
    const numOfFields: number = rows * cols;

    // workaround to manually add all fields without objects being the same reference.
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

    // set a fixed start and finsish field
    // fields[2][2] = { ...fields[2][2], start: true };
    fields[5][1] = { ...fields[5][1], start: true };
    // fields[8][8] = { ...fields[8][8], finish: true };
    fields[5][8] = { ...fields[5][8], finish: true };
    // fields[1][1] = { ...fields[1][1], searched: true };
    // fields[7][0] = { ...fields[7][0], path: true };
    fields[5][5] = { ...fields[5][5], grass: true, weight: 5 };
    fields[6][5] = { ...fields[6][5], grass: true, weight: 5 };
    fields[4][5] = { ...fields[4][5], grass: true, weight: 5 };
    fields[7][5] = { ...fields[7][5], grass: true, weight: 5 };
    fields[7][4] = { ...fields[7][4], grass: true, weight: 5 };
    fields[6][4] = { ...fields[6][4], grass: true, weight: 5 };
    fields[5][4] = { ...fields[5][4], grass: true, weight: 5 };
    fields[4][4] = { ...fields[4][4], grass: true, weight: 5 };
    // fields[5][3] = { ...fields[5][3], grass: true, weight: 5 };
    // fields[6][3] = { ...fields[6][3], grass: true, weight: 5 };
    // fields[4][3] = { ...fields[4][3], grass: true, weight: 5 };
    // fields[7][3] = { ...fields[7][3], grass: true, weight: 5 };

    currentGrid.set(fields);
</script>

<div
    class="bg-zinc-800 p-[2px] rounded-lg bg-gradient-to-t from-transparent via-[#379237] to-transparent shadow-[0_0_5px_1px_rgba(63,63,70,0.8)] shadow-slate-600"
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
</div>

<style lang="postcss">
</style>
