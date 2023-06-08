<script lang="ts">
    export let props = {
        start: false,
        finish: false,
        wall: false,
        walkedOver: false,
    };

    console.log(
        "props -> start:",
        props.start,
        "finish:",
        props.finish,
        "wall:",
        props.wall,
        "walkedOver:",
        props.walkedOver
    );
</script>

<div
    class="field hover:cursor-pointer w-8 h-8 border-solid border-gray-400 border"
/>

<style lang="postcss">
</style>
