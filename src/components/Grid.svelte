<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
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
        start: false,
        finish: false,
        wall: false,
        searched: false,
        path: false,
    };
    const rows = 10;
    const cols = 10;
    const numOfFields: number = rows * cols;

    // source: https://stackoverflow.com/a/68966725
    // create 2d array of fields with cols * rows amount of elements.
    // it creates a new reference of an array and a new reference of fieldObject
    // for each index to avoid that every array or fieldObject is the same reference
    // const fields: IField[][] = Array.from({ length: rows }, (_) =>
    //     new Array(cols).fill({ ...fieldObject })
    // );
    // const fields: IField[][] = Array.from({ length: rows }, (_) =>
    // new Array(cols).fill(fieldObject)
    // );

    // workaround to manually add all fields without objects being the same reference.
    // creates 2d array of fields with cols * rows amount of elements
    let fields: IField[][] = [];
    for (let i = 0; i < rows; i++) {
        fields[i] = [];
        for (let j = 0; j < cols; j++) {
            fields[i][j] = JSON.parse(JSON.stringify(fieldObject));
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
    fields[1][1] = { ...fields[1][1], searched: true };
    fields[7][0] = { ...fields[7][0], path: true };

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

<div>Number of fields: {numOfFields}</div>

<h2>Fields:</h2>
<div class="flex flex-col gap-1">
    {#each $currentGrid as row, i}
        <div class="flex flex-row gap-1">
            {#each row as col, j}
                <Field fieldData={col} firstIndex={i} secondIndex={j} />
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
</style>
