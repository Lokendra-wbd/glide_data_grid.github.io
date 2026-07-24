/** Strip trailing slash for react-router basename (Vite BASE_URL is e.g. "/repo/"). */
export function getRouterBasename() {
  const base = import.meta.env.BASE_URL ?? '/'
  const trimmed = base.replace(/\/$/, '')
  return trimmed || undefined
}
