<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import type { IField, IFieldProp } from "../interfaces/Field";
    import {
        currentGrid,
        isFinishNodeSet,
        isStartNodeSet,
        selectedNodeType,
    } from "../store/store";

    export let fieldData: IField = {
        id: 0,
        weight: 1,
        start: false,
        finish: false,
        path: false,
        wall: false,
        grass: false,
        snow: false,
        sand: false,
        water: false,
        searched: false,
        x: 0,
        y: 0,
    };

    const nodeColorMap = new Map<string, string>([
        ["wall", "wall.png"],
        ["grass", "grass.png"],
        ["snow", "snow.png"],
        ["sand", "sand.png"],
        ["water", "water.png"],
        ["start", "start.png"],
        ["finish", "goal.png"],
        ["searched", "#FCE700"],
        ["path", "#FF6D28"],
        ["default", "transparent"],
    ]);

    // map of all weighted nodes and their corresponding weights
    const weightedNodesMap = new Map<string, number>([
        ["grass", 5],
        ["sand", 10],
        ["snow", 25],
        ["water", 50],
    ]);

    let color = "";
    let bgImage = "";
    let startOrFinishNode = fieldData.start || fieldData.finish;
    let cursorType = startOrFinishNode ? "default" : "pointer";

    // get background gradient styles using the truthy field data properties and re-run this function every time one of the values changes
    $: getBackgroundGradient = () => {
        if (fieldData.path) {
            return ",radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 70%, rgba(255,109,40,1) 100%)";
        }
        if (fieldData.searched) {
            return ",radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 70%, rgba(255,255,0,1) 100%)";
        }

        // if neither path nor searched is true set no background gradient
        return "";
    };

    // get border color styles
    $: getBorderColor = () => {
        if (fieldData.path) {
            return nodeColorMap.get("path");
        }

        if (fieldData.searched) {
            return nodeColorMap.get("searched");
        }

        // if neither path nor searched is true set no new border-color
        return "";
    };

    afterUpdate(() => {
        setFieldColor();
    });

    onMount(() => {
        setFieldColor();
    });

    function setFieldColor() {
        checkStartAndFinish(true);

        if (!isFieldColored()) {
            color = nodeColorMap.get("default")!;
        }

        // set color according to prop in fieldData that is set to true
        const fieldProps = Object.keys(fieldData).filter(
            (key) => fieldData[key as IFieldProp] === true
        );

        if (fieldProps) {
            if (fieldProps.length === 1) {
                const colorValue = nodeColorMap.get(
                    fieldProps[0] as IFieldProp
                )!;

                if (colorValue?.endsWith(".png")) {
                    color = "transparent";
                    bgImage = colorValue;
                } else {
                    color = colorValue;
                    bgImage = "";
                }
            }

            // if mutiple props are true -> prioritize path color to show the path after searching
            if (
                fieldProps.length > 1 &&
                fieldProps.includes("path") &&
                !(
                    fieldData.grass ||
                    fieldData.wall ||
                    fieldData.snow ||
                    fieldData.sand ||
                    fieldData.water
                )
            ) {
                color = nodeColorMap.get("path")!;
            }
        }
    }

    // write the grid with the changed field into the store
    function setGrid(newFieldData: IField) {
        const grid: IField[][] = $currentGrid;
        const gridField = grid[fieldData.y][fieldData.x];

        grid[fieldData.y][fieldData.x] = {
            ...gridField,
            ...newFieldData,
        };

        currentGrid.set(grid);
    }

    // change a given fieldData prop to a given value
    function changeFieldData(fieldProp: IFieldProp, value: boolean) {
        // if start or finish is already set -> don't set it again
        if (fieldProp === "start") {
            if (!$isStartNodeSet) {
                fieldData[fieldProp] = value;
            }
            isStartNodeSet.set(true);
        } else if (fieldProp === "finish") {
            if (!$isFinishNodeSet) {
                fieldData[fieldProp] = value;
            }
            isFinishNodeSet.set(true);
        } else {
            fieldData[fieldProp] = value;
        }

        // change the weight of the field for given node types
        if (weightedNodesMap.has(fieldProp)) {
            fieldData.weight = weightedNodesMap.get(fieldProp)!;
        }

        setGrid(fieldData);
    }

    // reset field color to default color
    function resetFieldColor() {
        checkStartAndFinish(false);

        Object.keys(fieldData).forEach((key) => {
            if (
                key !== "id" &&
                key !== "weight" &&
                key !== "x" &&
                key !== "y"
            ) {
                fieldData[key as IFieldProp] = false;
            }
        });

        // reset the background image
        bgImage = "";
    }

    function checkStartAndFinish(value: boolean) {
        if (fieldData.start) {
            isStartNodeSet.set(value);
        }

        if (fieldData.finish) {
            isFinishNodeSet.set(value);
        }
    }

    // check if field has any color currently
    function isFieldColored() {
        return Object.keys(fieldData).some((key) => {
            return key !== "id" ? fieldData[key as IFieldProp] === true : false;
        });
    }

    function handleClick(event: MouseEvent) {
        // if left mouse button clicked
        if (event.buttons === 1) {
            // if field is already colored -> reset to default color
            if (isFieldColored()) {
                resetFieldColor();
            }
            // if field has no color -> color it according to node type
            else {
                const nodeType: string = $selectedNodeType;
                const fieldProp = nodeType.toLowerCase() as IFieldProp;
                changeFieldData(fieldProp, true);
            }
        }
    }

    // handle dragging mouse over multiple fields
    function handleMouseEnter(event: MouseEvent) {
        if (!fieldData.start && !fieldData.finish) {
            // if dragging over fields with left mouse -> color field according to selected node type
            if (event.buttons === 1) {
                // color = nodeColorMap.get("wall")!;
                const nodeType: string = $selectedNodeType;
                const fieldProp = nodeType.toLowerCase() as IFieldProp;
                changeFieldData(fieldProp, true);
            }
        }
    }

    // avoid opening context menu when right clicking on node
    function handleContextmenu(event: MouseEvent) {
        event.preventDefault();
    }
</script>

<div
    on:mousedown={handleClick}
    on:contextmenu={handleContextmenu}
    on:mouseenter={handleMouseEnter}
    class="field hover:cursor-pointer w-6 h-6 min-[400px]:w-7 min-[400px]:h-7 sm:w-8 sm:h-8 bg-contain bg-center border-solid border-zinc-300 border"
    style="background-color: {color}; background-image: url({bgImage}) {getBackgroundGradient()}; cursor: {cursorType}; border-color: {getBorderColor()};"
/>

<style lang="postcss">
</style>
