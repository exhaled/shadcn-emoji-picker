/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	trailingComma: "es5",
	semi: true,
	tabWidth: 4,
	singleQuote: true,
	jsxSingleQuote: true,
	bracketSameLine: true,
	printWidth: 140,
	plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  };
  
  export default config;
  