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

    console.log(
        "fields before:",
        fields,
        // "row:",
        // row,
        "total number of fields:",
        cols * rows,
        "fields[1][1]:",
        fields[1][5],
        "fields[8][8]:",
        fields[8][8],
        "currentGrid",
        $currentGrid
    );

    // set a fixed start and finsish field
    fields[1][5] = { ...fields[1][5], start: true };
    fields[8][8] = { ...fields[8][8], finish: true };
    // fields[1][1] = { ...fields[1][1], searched: true };
    // fields[7][0] = { ...fields[7][0], path: true };

    console.log(
        "fields after:",
        fields,
        // "row:",
        // row,
        "total number of fields:",
        cols * rows,
        "fields[1][5]:",
        fields[1][5],
        "fields[8][8]:",
        fields[8][8],
        "currentGrid",
        $currentGrid
    );

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
