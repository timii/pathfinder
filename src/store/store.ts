import { writable } from 'svelte/store';

function createSelectedNodeType() {
    const { subscribe, set } = writable("");

    return {
        subscribe,
        set: (value: string) => set(value)
    };
}

export const selectedNodeType = createSelectedNodeType();
