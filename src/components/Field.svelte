<script lang="ts">
    import { onMount } from "svelte";
    import type { IField, IFieldProp } from "../interfaces/Field";
    import {
        isFinishNodeSet,
        isStartNodeSet,
        selectedNodeType,
    } from "../store/store";

    export let props = {
        start: false,
        finish: false,
        wall: false,
        walkedOver: false,
    };

    const nodeColorMap = new Map<string, string>([
        ["wall", "blue"],
        ["start", "green"],
        ["finish", "red"],
    ]);

    let color = "white";
    let nodeType = "";
    let nodeSet = props.start || props.finish || props.walkedOver || props.wall;

    console.log(
        "props -> start:",
        props.start,
        "finish:",
        props.finish,
        "wall:",
        props.wall,
        "walkedOver:",
        props.walkedOver,
        "\n----------------------------------------------------------------"
    );

    onMount(() => {
        // check if start or finish value is true in props to then change color accordingly
        console.log("onMount called -> props:", props);
    });

    function handleClick(event: MouseEvent) {
        console.log("handleClick called -> event:", event);
        // only handle click if node is not a start or finish node
        if (!props.start && !props.finish) {
            // left mouse click -> node is changed to a wall
            if (event.button === 0) {
                console.log("left mouse clicked");
            }

            // right mouse click -> node is reset to starting color
            if (event.button === 2) {
                console.log("right mouse clicked");
            }
        }

        // removed for now because first version has a fixed start and finish node that
        // the user can't change and only place walls. Later version can add feature to let user set
        // start and finish block
        // if (color !== "white") {
        //     console.log("in if -> color:", color);
        //     color = "white";
        //     nodeSet = !nodeSet;
        //     // Set all props to false when clicked again
        //     Object.keys(props).forEach((key) => {
        //         props[key as IFieldProp] = false;
        //     });
        //     // And set color of field to new color
        //     color = nodeColorMap.get(nodeType)
        //         ? nodeColorMap.get(nodeType)!
        //         : "white";
        //     console.log(
        //         "handleClick called after:",
        //         props,
        //         "selectedNodeType:",
        //         nodeType,
        //         "color",
        //         nodeColorMap.get(nodeType)
        //     );
        // } else {
        //     console.log("in else -> color:", color);
        //     nodeSet = !nodeSet;
        //     nodeType = $selectedNodeType;
        //     // Dynamically set prop value to true
        //     props[nodeType as IFieldProp] = true;
        //     console.log(
        //         "handleClick called after:",
        //         props,
        //         "selectedNodeType:",
        //         nodeType,
        //         "color",
        //         nodeColorMap.get(nodeType)
        //     );
        //     // Object.keys(props).forEach((key) => {
        //     //     console.log(node)
        //     //     props[key as IFieldProp] = nodeType === key ? true : false;
        //     // });
        //     color = nodeColorMap.get(nodeType)
        //         ? nodeColorMap.get(nodeType)!
        //         : "white";
        // }
        // setStoreValue();
    }

    function setStoreValue() {
        console.log(
            "setStoreValue before -> nodeType:",
            $selectedNodeType,
            typeof $selectedNodeType,
            "isStartNodeSet:",
            $isStartNodeSet,
            "isFinishNodeSet:",
            $isFinishNodeSet
        );

        switch ($selectedNodeType) {
            case "start":
                isStartNodeSet.set(nodeSet);
                break;
            case "finish":
                isFinishNodeSet.set(nodeSet);
                break;
            default:
                break;
        }

        console.log(
            "setStoreValue after -> nodeType:",
            $selectedNodeType,
            "isStartNodeSet:",
            $isStartNodeSet,
            "isFinishNodeSet:",
            $isFinishNodeSet
        );
    }
</script>

<!-- on:click={handleClick} -->
<div
    on:mousedown={handleClick}
    class="field hover:cursor-pointer w-8 h-8 border-solid border-gray-400 border"
    style="background-color: {color};"
/>

<style lang="postcss">
</style>
