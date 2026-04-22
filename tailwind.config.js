/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: {
                    950: "#0a0a0a",
                    900: "#101010",
                    800: "#1a1a1a",
                    700: "#262626",
                },
                fog: {
                    500: "#8a8a8a",
                    400: "#a3a3a3",
                    300: "#c4c4c4",
                    200: "#e5e5e5",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "ui-monospace", "monospace"],
                serif: ["Instrument Serif", "Georgia", "serif"],
                display: ["Fraunces", "Georgia", "serif"],
            },
            letterSpacing: {
                tightest: "-0.04em",
            },
        },
    },
    plugins: [],
}
