/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1a1a2e',
                    light: '#16213e',
                    dark: '#0f0f1e',
                },
                accent: {
                    DEFAULT: '#c9a961',
                    hover: '#b89750',
                    light: '#d4b876',
                },
                light: '#f8f9fa',
                dark: '#2d2d2d',
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                luxury: '0 10px 40px rgba(0, 0, 0, 0.1)',
                'luxury-hover': '0 20px 60px rgba(0, 0, 0, 0.15)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
                'slide-in-right': 'slideInRight 0.8s ease-out forwards',
                'scale-in': 'scaleIn 0.6s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeInUp: {
                    from: {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                slideInLeft: {
                    from: {
                        opacity: '0',
                        transform: 'translateX(-50px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                slideInRight: {
                    from: {
                        opacity: '0',
                        transform: 'translateX(50px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                scaleIn: {
                    from: {
                        opacity: '0',
                        transform: 'scale(0.9)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'scale(1)',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
};
