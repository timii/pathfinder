/** @type {import('tailwindcss').Config} */
import { CONSTS } from './src/utils/consts'
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {},
        screens: { 'customheight': { 'raw': `(min-height: ${CONSTS.statsMinHeight}px)` }, }
    },
    plugins: [],
};
