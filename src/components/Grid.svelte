<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField } from "../interfaces/Field";
    import Field from "./Field.svelte";

    console.log("algorithms:", algorithms, algorithms[0].functionCallback());

    const fieldObject: IField = {
        start: false,
        finish: false,
        wall: false,
        walkedOver: false,
    };
    const rows = 10;
    const cols = 10;
    const numOfFields: number = rows * cols;

    // source: https://stackoverflow.com/a/68966725
    // create 2d array of fields with cols * rows amount of elements.
    // it creates a new reference of an array for each index to avoid
    // that every array is the same reference
    const fields: IField[][] = Array.from({ length: rows }, (_) =>
        new Array(cols).fill(fieldObject)
    );

    console.log(
        "fields before:",
        fields,
        // "row:",
        // row,
        "total number of fields:",
        cols * rows,
        "fields[1][1]:",
        fields[1][1],
        "fields[8][8]:",
        fields[8][8]
    );

    // set a fixed start and finsish field
    fields[1][1] = { ...fields[1][1], start: true };
    fields[8][8] = { ...fields[8][8], finish: true };

    console.log(
        "fields after:",
        fields,
        // "row:",
        // row,
        "total number of fields:",
        cols * rows,
        "fields[1][1]:",
        fields[1][1],
        "fields[8][8]:",
        fields[8][8]
    );
</script>

<div>Number of fields: {numOfFields}</div>

<h2>Fields:</h2>
<div class="flex gap-1">
    {#each fields as row, i}
        <div class="flex flex-col gap-1">
            {#each row as col, j}
                <Field props={col} />
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
</style>
