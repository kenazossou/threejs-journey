import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import restart from 'vite-plugin-restart'

function findHtmlEntries(rootDirectory) {
    const entries = []

    function walk(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const fullPath = path.join(directory, entry.name)

            if (entry.isDirectory()) {
                walk(fullPath)
                continue
            }

            if (entry.isFile() && entry.name === 'index.html' && fullPath !== path.join(rootDirectory, 'index.html')) {
                entries.push(fullPath)
            }
        }
    }

    walk(rootDirectory)
    return entries
}

const lessonPages = findHtmlEntries('src')

export default defineConfig({
    root: 'src/', // Sources files (typically where index.html is)
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: "/threejs-journey/",
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: true
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true, // Add sourcemap
        rollupOptions: {
            input: ['src/index.html', ...lessonPages]
        }
    },
    plugins:
    [
        restart({ restart: [ '../static/**', ] }) // Restart server on static file change
    ],
})