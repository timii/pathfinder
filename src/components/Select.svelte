<script lang="ts">
    import type { ISelectItem } from "../interfaces/Select";
    import { isVisualizing } from "../store/store";

    // external select component
    import Select from "svelte-select";

    export let disabled = false;
    export let items: ISelectItem[] = [];
    export let startValue = {};
    export let onChangeCallback = (e: CustomEvent) => {};
    export let onFocusCallback = (e: CustomEvent) => {};
    export let groupBy = (item: ISelectItem): string | undefined => {
        return undefined;
    };
    export let width = "255px";

    let value = startValue;
</script>

<div style={$isVisualizing ? "pointer-events: none;" : ""}>
    <Select
        {items}
        on:change={onChangeCallback}
        on:focus={onFocusCallback}
        {disabled}
        {groupBy}
        bind:value
        showChevron={true}
        clearable={false}
        searchable={false}
        --background="#27272a"
        --list-background="#27272a"
        --list-max-height="300px"
        --width={width}
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
