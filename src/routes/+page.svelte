<script lang="ts">
    import type { Field } from '../types/Field'

    const fieldObject: Field = {
        start: false,
        finish: false,
        wall: false,
        walkedOver: false
    }
    const rows = 10
    const cols = 10
    const numOfFields: number = rows * cols;
    const fields = []
    const row = new Array<Field[]>(cols)
    row.fill(fieldObject)

    for(let i = 0; i < rows; i++) {
        fields.push(row);
    }

    console.log("fields:", fields, typeof fields, "row:", row, typeof fields[0])
</script>

    <div>Number of fields: {numOfFields}</div>
    
<h2>Fields:</h2>
<div class="fields-container flex gap-1">

{#each fields as row, i}
    <div class="row flex flex-col gap-1">

    {#each row as col, j}
        <!-- <div class="field">field ({i})</div> -->
        <div class="field hover:cursor-pointer w-8 h-8 border-solid border-gray-400 border"></div>
    {/each}
    </div>
{/each}
</div>


<style lang="postcss">
    :global(html) {
        background-color: theme(colors.zinc.900);
        color: theme(colors.neutral.50);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
