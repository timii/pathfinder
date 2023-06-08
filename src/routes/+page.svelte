<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IField } from "../interfaces/Field";

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
    const fields: IField[][] = [];

    // create row of fields with 'cols' amount of elements in the row
    const row: IField[] = new Array<IField>(cols);
    row.fill(fieldObject);

    for (let i = 0; i < rows; i++) {
        fields.push(row);
    }

    console.log(
        "fields:",
        fields,
        "row:",
        row,
        "total number of fields:",
        cols * rows
    );
</script>

<main
    class="flex flex-col items-center text-white bg-zinc-900 h-screen font-sans font-lg font-semibold"
>
    <div>Number of fields: {numOfFields}</div>

    <h2>Fields:</h2>
    <div class="flex gap-1">
        {#each fields as row, i}
            <div class="flex flex-col gap-1">
                {#each row as col, j}
                    <div
                        class="field hover:cursor-pointer w-8 h-8 border-solid border-gray-400 border"
                    />
                {/each}
            </div>
        {/each}
    </div>
</main>

<style lang="postcss">
</style>
