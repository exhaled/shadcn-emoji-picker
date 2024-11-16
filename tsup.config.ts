import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.tsx'],
	format: 'esm',
	dts: true, // Generate declaration file (.d.ts)
	outDir: 'dist',
	clean: true, // Clean the output directory before building
	minify: true,
	sourcemap: true,
});
