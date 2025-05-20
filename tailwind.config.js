/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderColor: {
                border: 'hsl(var(--border))', // border-border 지원
            },
            backgroundColor: {
                background: 'hsl(var(--background))',
            },
            textColor: {
                foreground: 'hsl(var(--foreground))',
            },
            // 필요 시 추가로 다른 CSS 변수도 등록 가능
        },
    },
    plugins: [],
}