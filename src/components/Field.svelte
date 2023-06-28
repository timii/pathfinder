<script lang="ts">
    import { selectedNodeType } from "../store/store";

    const nodeColorMap = new Map<string, string>([
        ["wall", "blue"],
        ["start", "green"],
        ["finish", "red"],
    ]);

    let color = "white";
    let nodeType = "";
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
        if (color !== "white") {
            console.log("in if -> color:", color);
            color = "white";
        } else {
            console.log("in else -> color:", color);
            nodeType = $selectedNodeType;
            console.log(
                "handleClick called before:",
                props,
                "selectedNodeType:",
                nodeType,
                "color",
                nodeColorMap.get(nodeType)
            );
            props.start = true;
            color = nodeColorMap.get(nodeType)
                ? nodeColorMap.get(nodeType)!
                : "white";
            // color = "red";
            console.log("handleClick called after:", props);
        }
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
