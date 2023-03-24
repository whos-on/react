const { green, emerald } = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: green[500],
                secondary: emerald[500],
            },
            fontSize: {
                "2xs": ".625rem",
                "3xs": ".5rem",
            },
        },
    },
    plugins: [],
}
