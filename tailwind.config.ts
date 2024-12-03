export default {
	content: ['./src/**/*.{ts,tsx}', './playground/**/*.tsx', './playground/index.html'],
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
	darkMode: 'class',
};
