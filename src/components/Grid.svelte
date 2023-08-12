<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import { getRandomInt } from "../algorithms/utils";
    import type { IField } from "../interfaces/Field";
    import { currentGrid } from "../store/store";
    import Field from "./Field.svelte";

    if (algorithms[0].functionCallback) {
        console.log(
            "algorithms:",
            algorithms
            // algorithms[0].functionCallback()
        );
    } else {
        console.log("algorithms:", algorithms);
    }

    const fieldObject: IField = {
        id: 0,
        start: false,
        finish: false,
        wall: false,
        searched: false,
        path: false,
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
                } as IField)
            );
        }
    }

    // set a fixed start and finsish field
    // fields[2][2] = { ...fields[2][2], start: true };
    fields[5][2] = { ...fields[5][2], start: true };
    // fields[8][8] = { ...fields[8][8], finish: true };
    fields[5][7] = { ...fields[5][7], finish: true };
    // fields[1][1] = { ...fields[1][1], searched: true };
    // fields[7][0] = { ...fields[7][0], path: true };

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
                        <Field fieldData={col} firstIndex={i} secondIndex={j} />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
</style>
