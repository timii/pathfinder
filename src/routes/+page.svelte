<script lang="ts">
    const fieldObject = {
        start: false,
        finish: false,
        wall: false
    }
    const rows = 5
    const cols = 5
    const numOfFields = rows * cols;
    const fields = new Array(numOfFields)
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
