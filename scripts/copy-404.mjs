import { copyFileSync, existsSync, writeFileSync } from 'node:fs'

if (!existsSync('dist/index.html')) {
  console.error('dist/index.html not found — run vite build first')
  process.exit(1)
}

copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/build.txt', `built ${new Date().toISOString()}\n`)
console.log('Copied dist/index.html → dist/404.html for GitHub Pages SPA routing')
