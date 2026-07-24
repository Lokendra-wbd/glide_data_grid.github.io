/**
 * Data volume controls — configure via .env (all VITE_ prefixed).
 *
 * VITE_BULK_ENABLED=true|false     — turn bulk generator on/off (default true)
 * VITE_BULK_YEARS=2027,2028        — years that receive bulk data (default 2027)
 * VITE_MAX_EVENTS_PER_FETCH=600    — hard cap on events returned per API call
 * VITE_BULK_SLOT_DENSITY=1         — 1=all slots, 2=every other slot (half data)
 * VITE_BULK_DAYS=                  — optional comma list e.g. Monday,Tuesday
 * VITE_LOAD_CHUNK_MS=16            — ms yield between generation chunks (keeps UI alive)
 */
export function getDataConfig() {
  const bulkEnabled = import.meta.env.VITE_BULK_ENABLED !== 'false'
  const yearsRaw = import.meta.env.VITE_BULK_YEARS ?? '2027'
  const bulkYears = yearsRaw.split(',').map((y) => Number(y.trim())).filter(Boolean)
  const maxEventsPerFetch = Number(import.meta.env.VITE_MAX_EVENTS_PER_FETCH ?? '600')
  const slotDensity = Math.max(1, Number(import.meta.env.VITE_BULK_SLOT_DENSITY ?? '1'))
  const daysRaw = import.meta.env.VITE_BULK_DAYS
  const bulkDays = daysRaw ? daysRaw.split(',').map((d) => d.trim()) : null
  const chunkDelayMs = Number(import.meta.env.VITE_LOAD_CHUNK_MS ?? '16')

  return {
    bulkEnabled,
    bulkYears,
    maxEventsPerFetch,
    slotDensity,
    bulkDays,
    chunkDelayMs,
  }
}

export function getDataConfigLabel() {
  const c = getDataConfig()
  return {
    bulkEnabled: c.bulkEnabled,
    years: c.bulkYears.join(', '),
    maxEvents: c.maxEventsPerFetch,
    slotDensity: c.slotDensity,
  }
}
