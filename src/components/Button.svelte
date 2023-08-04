<script lang="ts">
    import { isVisualizing } from "../store/store";

    export let onClickCallback = () =>
        console.log("onClickCallback not defined");

    export let text = "";
</script>

<button
    on:click={onClickCallback}
    disabled={$isVisualizing}
    class="bg-zinc-800 text-zinc-200 rounded-lg leading-none p-2.5 pb-3 shadow-[inset_0_2px_0_0_rgba(63,63,70,0.8)] border-black border disabled:text-opacity-50 disabled:bg-opacity-50 hover:bg-[#313135] active:bg-zinc-800 duration-100 ease-in-out disabled:pointer-events-none"
    >{text}</button
>

<style lang="postcss">
</style>
