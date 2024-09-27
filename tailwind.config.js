import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

const flowbite = require('flowbite-react/tailwind')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './index.html',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/flowbite/**/*.js",
        flowbite.content(),

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    theme: {
        extend: {
            colors: {

                dark: {
                100: "#cfd1d1",
                200: "#9fa2a3",
                300: "#6f7476",
                400: "#3f4548",
                500: "#0f171a",
                600: "#0c1215",
                700: "#090e10",
                800: "#06090a",
                900: "#030505"
},

                // dark: {
                //     300: '#202E36',
                //     400: '#1A262D',
                //     500: '#141E22',
                //     700: '#0F171A'
                // }
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    safelist : [
        {
            pattern : /^datatable-.*$/,
        }
    ],

    plugins: [
        require('flowbite/plugin')({
            charts : true,
        }),
        flowbite.plugin(),
        forms
    ],
};
