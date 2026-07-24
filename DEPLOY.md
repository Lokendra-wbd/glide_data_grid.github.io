# GitHub Pages (static deploy)

Production builds use the Vite `base` path `/lokendra-wbd.glide_data_grid.github.io/`.

| | URL |
|---|---|
| **Live site** | https://Lokendra-wbd.github.io/lokendra-wbd.glide_data_grid.github.io/ |
| **LRV grid** | https://Lokendra-wbd.github.io/lokendra-wbd.glide_data_grid.github.io/lrv |

## Deploy (automatic — recommended)

1. Push to `main` on **`lokendra-wbd.glide_data_grid.github.io`**
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
