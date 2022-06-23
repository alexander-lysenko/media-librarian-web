import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
// @ts-ignore
import autoprefixer from 'autoprefixer'
import laravel from 'vite-plugin-laravel'

export default defineConfig({
	plugins: [
		laravel({
			postcss: [
				tailwindcss(),
				autoprefixer(),
			],
		}),
	],
})
