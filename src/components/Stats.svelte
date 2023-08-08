<script lang="ts">
    import { fieldsSearched, pathLength, showStats } from "../store/store";
</script>

{#if $showStats}
    <div
        class="bg-zinc-800 rounded-lg flex flex-col justify-center items-center p-4 gap-2 text border-black border shadow-[inset_0_2px_0_0_rgba(63,63,70,0.8)] text-zinc-200"
    >
        <div class="text-2xl border-b-2 border-[#379237] leading-[1.1]">
            Stats
        </div>
        <div class="flex flex-col items-center">
            <p>Shortest Path Length</p>
            <p>{$pathLength}</p>
            <p>Amount of Fields Searched</p>
            <p>{$fieldsSearched}</p>
        </div>
    </div>
{/if}

<style lang="postcss">
</style>
