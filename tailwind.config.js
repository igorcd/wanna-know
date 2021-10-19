module.exports = {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        
        fontFamily: {
            sans: ['Ubuntu']
        },
        extend: {
            screens: {
                'max-sm': { 'max': '639px' },
                'touch': { 'raw': '(pointer: coarse)' },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
