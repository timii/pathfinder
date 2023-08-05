<script lang="ts">
    import { algorithms } from "../algorithms/algorithms";
    import type { IAlgorithm } from "../interfaces/Algorithm";
    import { isVisualizing, selectedAlgo } from "../store/store";

    // external select component
    import Select from "svelte-select";

    export let disabled = false;

    // map algorithms to be able to use in select
    const mappedAlgos = algorithms.map((el) => {
        return { label: el.name, value: el.name };
    });

    // initially select first algorithm
    // TODO: add check later if algorithm is already set in localStorage
    let value: { label: string; value: string } = mappedAlgos[0];
    selectedAlgo.set(value.label);

    function onChange(event: Event) {
        console.log("onChange called -> event:", event, "selected:", value);
        selectedAlgo.set(value.label);
    }
</script>

<div style={$isVisualizing ? "pointer-events: none;" : ""}>
    <Select
        items={mappedAlgos}
        on:change={onChange}
        {disabled}
        bind:value
        showChevron={true}
        clearable={false}
        searchable={false}
        --background="#27272a"
        --list-background="#27272a"
        --width="230px"
        --border="1px solid black"
        --border-hover="1px solid black"
        --border-focused="1px solid black"
        --border-radius="8px"
        --list-border-radius="8px"
        --height="40px"
        --chevron-height="39px"
        --disabled-border-color="black"
        --disabled-background="rgba(39, 39, 42, 0.5)"
        --disabled-color="rgba(228, 228, 231, 0.5)"
        --item-hover-bg="#313135"
        --item-is-active-bg="#313135"
        containerStyles="box-shadow: inset 0 2px 0 0 rgba(63,63,70,0.8); cursor: pointer;"
        inputStyles="cursor: pointer;"
    />
</div>

<style lang="postcss">
</style>
