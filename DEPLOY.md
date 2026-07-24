# GitHub Pages (static deploy)

Production builds use the Vite `base` path `/glide_data_grid/` (from `package.json` → `homepage`).

| | URL |
|---|---|
| **Live site** | https://Lokendra-wbd.github.io/glide_data_grid/ |
| **LRV grid** | https://Lokendra-wbd.github.io/glide_data_grid/lrv |

## Deploy (automatic — recommended)

1. Push to `main` on **`Lokendra-wbd/glide_data_grid`**
2. In repo **Settings → Pages**, set **Source** to **GitHub Actions**
3. Workflow `.github/workflows/deploy.yml` builds and publishes `dist/`

## Deploy (manual)

```bash
npm run deploy
```

## Local production preview

```bash
npm run build
npm run preview
```
