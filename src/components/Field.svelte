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
        ["default", "white"],
    ]);

    let color = "white";
    let nodeType = "";
    let nodeSet = props.start || props.finish || props.walkedOver || props.wall;
    let startOrFinishNode = props.start || props.finish;

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
        nodeType = $selectedNodeType;

        // check if start or finish value is true in props to then change color accordingly
        // console.log("onMount called -> props:", props);
        if (props.start) {
            color = nodeColorMap.get("start")!;
        }
        if (props.finish) {
            color = nodeColorMap.get("finish")!;
        }
    });

    function handleClick(event: MouseEvent) {
        console.log("handleClick called -> event:", event);
        // only handle click if node is not a start or finish node
        if (!props.start && !props.finish) {
            // left mouse click -> node is changed to a wall
            if (event.buttons === 1) {
                console.log("left mouse clicked");
                color = nodeColorMap.get("wall")!;
            }

            // right mouse click -> node is reset to starting color
            if (event.button === 2) {
                console.log("right mouse clicked");
                color = nodeColorMap.get("default")!;
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

    // function to handle dragging mouse over multiple fields while holding left or right button
    function handleMouseEnter(event: MouseEvent) {
        if (!props.start && !props.finish) {
            // console.log("handleMouseEnter -> event:", event);
            if (event.buttons === 1) {
                console.log("mouse enter with left click");
                color = nodeColorMap.get("wall")!;
            }

            if (event.buttons === 2) {
                console.log("mouse enter with right click");
                color = nodeColorMap.get("default")!;
            }
        }
    }

    // function to avoid opening context menu when right clicking on node
    function handleContextmenu(event: MouseEvent) {
        console.log("handleContextmenu -> event:", event);
        event.preventDefault();
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

<div
    on:mousedown={handleClick}
    on:contextmenu={handleContextmenu}
    on:mouseenter={handleMouseEnter}
    class="field hover:cursor-pointer w-8 h-8 border-solid border-gray-400 border"
    style="background-color: {color}; cursor: {startOrFinishNode
        ? 'default'
        : 'pointer'};"
/>

<style lang="postcss">
</style>
