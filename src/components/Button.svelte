<script lang="ts">
    export let onClickCallback = () => {};

    export let text = "";
    export let disabled = false;
</script>

<button
    on:click={onClickCallback}
    {disabled}
    class="bg-zinc-800 text-zinc-100 rounded-lg leading-none p-2.5 pb-3 shadow-[inset_0_2px_0_0_rgba(63,63,70,0.8)] border-black border disabled:text-opacity-50 disabled:bg-opacity-50 hover:bg-[#313135] active:bg-zinc-800 duration-200 ease-in-out disabled:pointer-events-none max-h-10"
    >{text}</button
>

<style lang="postcss">
</style>
