<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import type { IField, IFieldProp } from "../interfaces/Field";
    import { currentGrid, selectedNodeType } from "../store/store";

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

    // let nodeType = "";
    // let nodeSet =
    //     fieldData.start ||
    //     fieldData.finish ||
    //     fieldData.searched ||
    //     fieldData.wall;
    // TODO: set dynamic maxRow and maxCol and remove hardcoded 9
    // let borderField = {
    //     topBorder: firstIndex === 0,
    //     rightBorder: secondIndex === 9,
    //     bottomBorder: firstIndex === 9,
    //     leftBorder: secondIndex === 0,
    // };

    // set correct border widths for fields at the edges of the grid
    const getBorderStyle = (val: boolean, styleName: string) =>
        val ? styleName + ":2px" : styleName + ":1px";
    // const fieldBorderStyles = `
    // ${getBorderStyle(borderField.topBorder, "border-top-width")};
    // ${getBorderStyle(borderField.rightBorder, "border-right-width")};
    // ${getBorderStyle(borderField.bottomBorder, "border-bottom-width")};
    // ${getBorderStyle(borderField.leftBorder, "border-left-width")};`;
    // console.log("field -> fieldBorderStyles:", fieldBorderStyles);

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
        // console.log("afterUpdate called -> fieldData:", fieldData);
        setFieldColor();
    });

    onMount(() => {
        setFieldColor();
    });

    function setFieldColor() {
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
                // color = nodeColorMap.get("path")!;
                // bgImage = "";
            }
        }
    }

    // write the grid with the changed field into the store
    function setGrid(newFieldData: IField) {
        // console.log("setGrid -> x:", fieldData.x, fieldData.y, newFieldData);
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
        fieldData[fieldProp] = value;

        // change the weight of the field for given node types
        if (weightedNodesMap.has(fieldProp)) {
            fieldData.weight = weightedNodesMap.get(fieldProp)!;
        }

        setGrid(fieldData);
    }

    // reset field color to default color
    function resetFieldColor() {
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

    // check if field has any color currently
    function isFieldColored() {
        return Object.keys(fieldData).some((key) => {
            return key !== "id" ? fieldData[key as IFieldProp] === true : false;
        });
    }

    function handleClick(event: MouseEvent) {
        // console.log("handleClick called -> event:", event);
        // only handle click if node is not a start or finish node
        if (!fieldData.start && !fieldData.finish) {
            // if left mouse button clicked
            if (event.buttons === 1) {
                // console.log("left mouse clicked");
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

    // handle dragging mouse over multiple fields
    function handleMouseEnter(event: MouseEvent) {
        if (!fieldData.start && !fieldData.finish) {
            // if dragging over fields with left mouse -> color field according to selected node type
            if (event.buttons === 1) {
                console.log("mouse enter with left click");
                // color = nodeColorMap.get("wall")!;
                const nodeType: string = $selectedNodeType;
                const fieldProp = nodeType.toLowerCase() as IFieldProp;
                console.log("selected node type:", fieldProp);
                changeFieldData(fieldProp, true);
            }
        }
    }

    // avoid opening context menu when right clicking on node
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
    class="field hover:cursor-pointer w-8 h-8 border-solid border-zinc-300 border"
    style="background-color: {color}; background-image: url({bgImage}) {getBackgroundGradient()}; cursor: {cursorType}; border-color: {getBorderColor()};"
/>

<style lang="postcss">
</style>
