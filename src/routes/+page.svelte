<script lang="ts">
    import type { Field } from '../types/Field'

    const fieldObject: Field = {
        start: false,
        finish: false,
        wall: false,
        walkedOver: false
    }
    const rows = 5
    const cols = 5
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
<div class="fields-container">

{#each fields as row, i}
    <div class="row">

    {#each row as col, j}
        <div class="field">field ({i})</div>
    {/each}
    </div>
{/each}
</div>


<style lang="postcss">
    :global(html) {
        background-color: theme(colors.zinc.900);
        color: theme(colors.neutral.50);
    }

    .fields-container {
        display: flex;
        flex-direction: column;
    }

    .row {
        display: flex;
    }

    .field {
        width: 100px;
    }
</style>
