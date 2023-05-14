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
    const fields = new Array<Field>(numOfFields)
    fields.fill(fieldObject)
    console.log("fields:", fields)
</script>

    <div>Number of fields: {numOfFields}</div>
    
<h2>Field:</h2>
{#each fields as field, i}
    <div>field ({i})</div>
{/each}


<style lang="postcss">
    :global(html) {
        background-color: theme(colors.zinc.900);
        color: theme(colors.neutral.50);
    }
</style>
