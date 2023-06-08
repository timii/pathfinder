<script lang="ts">
    let color = "white";
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
    function handleClick() {
        console.log("handleClick called before:", props);
        props.start = true;
        color = "red";
        console.log("handleClick called after:", props);
    }
</script>

<div
    on:click={handleClick}
    on:keydown={handleClick}
    class="field hover:cursor-pointer w-8 h-8 border-solid border-gray-400 border"
    style="background-color: {color};"
/>

<style lang="postcss">
</style>
