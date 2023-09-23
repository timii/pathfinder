/** @type {import('tailwindcss').Config} */
import { CONSTS } from './src/utils/consts'
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {},
        screens: {
            'customheight': { 'raw': `(min-height: ${CONSTS.statsMinHeight}px)` },
            // => @media (min-height: {CONSTS.statsMinHeight}px) { ... }

            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
        }
    },
    plugins: [],
};
