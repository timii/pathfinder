<script lang="ts">
    import { selectedNodeType } from "../store/store";

    let selected: string = "wall";
    selectedNodeType.set(selected);

    function onChange(event: Event) {
        selected = (event.target as HTMLInputElement).value;
        selectedNodeType.set(selected);
    }
</script>

<div class="">
    <label>
        <input
            checked={selected === "start"}
            type="radio"
            on:change={onChange}
            id="start"
            name="node-type"
            value="start"
        />
        start
    </label>
    <label>
        <input
            checked={selected === "finish"}
            type="radio"
            on:change={onChange}
            id="finish"
            name="node-type"
            value="finish"
        />
        finish
    </label>
    <label>
        <input
            checked={selected === "wall"}
            type="radio"
            on:change={onChange}
            id="wall"
            name="node-type"
            value="wall"
        />
        wall
    </label>
    <p>Current node type: {$selectedNodeType}</p>
</div>

<style lang="postcss">
</style>
