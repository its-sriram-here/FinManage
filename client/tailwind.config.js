/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    dark: '#4f46e5',    // Indigo 600
                    light: '#818cf8',   // Indigo 400
                },
                secondary: {
                    DEFAULT: '#8b5cf6', // Violet 500
                    dark: '#7c3aed',    // Violet 600
                },
                accent: '#f43f5e',    // Rose 500
                surface: {
                    DEFAULT: '#ffffff',
                    dark: '#0f172a',    // Slate 900
                    glass: 'rgba(255, 255, 255, 0.7)',
                },
                background: '#f8fafc', // Slate 50
            },
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'glass-shine': 'glassShine 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
