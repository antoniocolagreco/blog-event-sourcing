import { defineConfig } from 'vitest/config';

export default defineConfig({
	base: './src',
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'],
			exclude: ['src/**/index.ts', '**.test.ts', 'src/models/'],
		},
	},
});
