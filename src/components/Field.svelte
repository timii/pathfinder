<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import type { IField, IFieldProp } from "../interfaces/Field";
    import { currentGrid } from "../store/store";

    export let fieldData: IField = {
        id: 0,
        start: false,
        finish: false,
        wall: false,
        searched: false,
        path: false,
    };
    export let firstIndex: number;
    export let secondIndex: number;

    const nodeColorMap = new Map<string, string>([
        ["wall", "#0000FF"],
        ["start", "#00FF00"],
        ["finish", "#FF0000"],
        ["searched", "#FFFF00"],
        ["path", "#db9409"],
        ["default", "transparent"],
    ]);

    let color = "";
    let nodeType = "";
    let nodeSet =
        fieldData.start ||
        fieldData.finish ||
        fieldData.searched ||
        fieldData.wall;
    let startOrFinishNode = fieldData.start || fieldData.finish;

    // console.log(
    //     "fieldData -> start:",
    //     fieldData.start,
    //     "finish:",
    //     fieldData.finish,
    //     "wall:",
    //     fieldData.wall,
    //     "searched:",
    //     fieldData.searched,
    //     "firstIndex:",
    //     firstIndex,
    //     "secondIndex:",
    //     secondIndex,
    //     "\n----------------------------------------------------------------"
    // );

    afterUpdate(() => {
        // console.log("afterUpdate called -> fieldData:", fieldData);
        setFieldColor();
    });

    onMount(() => {
        setFieldColor();
    });

    function setFieldColor() {
        // nodeType = $selectedNodeType;

        // check if start or finish value is true in fieldData to then change color accordingly
        // console.log("onMount called -> fieldData:", fieldData);
        if (
            !fieldData.start &&
            !fieldData.finish &&
            !fieldData.searched &&
            !fieldData.path &&
            !fieldData.wall
        ) {
            color = nodeColorMap.get("default")!;
        }
        if (fieldData.start) {
            color = nodeColorMap.get("start")!;
        }
        if (fieldData.finish) {
            color = nodeColorMap.get("finish")!;
        }
        if (fieldData.wall) {
            color = nodeColorMap.get("wall")!;
        }
        if (fieldData.searched) {
            color = nodeColorMap.get("searched")!;
        }
        if (fieldData.path) {
            color = nodeColorMap.get("path")!;
        }
    }

    // function to write the grid with the changed field into the store
    function setGrid(value: boolean) {
        const grid: IField[][] = $currentGrid;
        const gridField = grid[firstIndex][secondIndex];

        grid[firstIndex][secondIndex] = {
            ...gridField,
            wall: value,
        };

        currentGrid.set(grid);
    }

    function changeFieldData(fieldProp: IFieldProp, value: boolean) {
        fieldData[fieldProp] = value;
        setGrid(value);
    }

    function handleClick(event: MouseEvent) {
        console.log("handleClick called -> event:", event);
        // only handle click if node is not a start or finish node
        if (!fieldData.start && !fieldData.finish) {
            // left mouse click -> node is changed to a wall
            if (event.buttons === 1) {
                console.log("left mouse clicked");
                color = nodeColorMap.get("wall")!;
                changeFieldData("wall", true);
            }

            // right mouse click -> node is reset to starting color
            if (event.button === 2) {
                console.log("right mouse clicked");
                color = nodeColorMap.get("default")!;
                changeFieldData("wall", false);
            }
        }

        // removed for now because first version has a fixed start and finish node that
        // the user can't change and only place walls. Later version can add feature to let user set
        // start and finish block
        // if (color !== "white") {
        //     console.log("in if -> color:", color);
        //     color = "white";
        //     nodeSet = !nodeSet;
        //     // Set all fieldData to false when clicked again
        //     Object.keys(fieldData).forEach((key) => {
        //         fieldData[key as IFieldProp] = false;
        //     });
        //     // And set color of field to new color
        //     color = nodeColorMap.get(nodeType)
        //         ? nodeColorMap.get(nodeType)!
        //         : "white";
        //     console.log(
        //         "handleClick called after:",
        //         fieldData,
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
        //     fieldData[nodeType as IFieldProp] = true;
        //     console.log(
        //         "handleClick called after:",
        //         fieldData,
        //         "selectedNodeType:",
        //         nodeType,
        //         "color",
        //         nodeColorMap.get(nodeType)
        //     );
        //     // Object.keys(fieldData).forEach((key) => {
        //     //     console.log(node)
        //     //     fieldData[key as IFieldProp] = nodeType === key ? true : false;
        //     // });
        //     color = nodeColorMap.get(nodeType)
        //         ? nodeColorMap.get(nodeType)!
        //         : "white";
        // }
        // setStoreValue();
    }

    // function to handle dragging mouse over multiple fields while holding left or right button
    function handleMouseEnter(event: MouseEvent) {
        if (!fieldData.start && !fieldData.finish) {
            // console.log("handleMouseEnter -> event:", event);
            if (event.buttons === 1) {
                console.log("mouse enter with left click");
                color = nodeColorMap.get("wall")!;
                changeFieldData("wall", true);
            }

            if (event.buttons === 2) {
                console.log("mouse enter with right click");
                color = nodeColorMap.get("default")!;
                changeFieldData("wall", false);
            }
        }
    }

    // function to avoid opening context menu when right clicking on node
    function handleContextmenu(event: MouseEvent) {
        console.log("handleContextmenu -> event:", event);
        event.preventDefault();
    }

    // function setStoreValue() {
    //     console.log(
    //         "setStoreValue before -> nodeType:",
    //         $selectedNodeType,
    //         typeof $selectedNodeType,
    //         "isStartNodeSet:",
    //         $isStartNodeSet,
    //         "isFinishNodeSet:",
    //         $isFinishNodeSet
    //     );

    //     switch ($selectedNodeType) {
    //         case "start":
    //             isStartNodeSet.set(nodeSet);
    //             break;
    //         case "finish":
    //             isFinishNodeSet.set(nodeSet);
    //             break;
    //         default:
    //             break;
    //     }

    //     console.log(
    //         "setStoreValue after -> nodeType:",
    //         $selectedNodeType,
    //         "isStartNodeSet:",
    //         $isStartNodeSet,
    //         "isFinishNodeSet:",
    //         $isFinishNodeSet
    //     );
    // }
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
