import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Derive Vite base from package.json homepage (GitHub Pages project URL). */
function githubPagesBase() {
  try {
    const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
    if (!pkg.homepage) return '/'
    const { pathname } = new URL(pkg.homepage)
    if (!pathname || pathname === '/') return '/'
    return pathname.endsWith('/') ? pathname : `${pathname}/`
  } catch {
    return '/glide_data_grid/'
  }
}

const GITHUB_PAGES_BASE = githubPagesBase()

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
}))
