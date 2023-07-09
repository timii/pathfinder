import { writable } from 'svelte/store';

// Generic function to create store variables 
function createStoreValue(startValue: any) {
    console.log("createStoreValue -> value:", startValue, typeof startValue)
    const { subscribe, set } = writable(startValue);

    return {
        subscribe,
        set: (value: typeof startValue) => set(value)
    };
}

export const currentGrid = createStoreValue([]);

export const selectedNodeType = createStoreValue("");
export const selectedAlgo = createStoreValue("");

export const isStartNodeSet = createStoreValue(false);
export const isFinishNodeSet = createStoreValue(false);

