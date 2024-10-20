/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                text: "hsl(var(--text))",
                background: "hsl(var(--background))",
                primary: "hsl(var(--primary))",
                secondary: "hsl(var(--secondary))",
                accent: "hsl(var(--accent))",
            },
            container: {
                center: true,
                padding: "1rem",
            },
        },
    },
    plugins: [],
};
