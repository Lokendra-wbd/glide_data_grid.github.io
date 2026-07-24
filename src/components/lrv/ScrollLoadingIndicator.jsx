export default function ScrollLoadingIndicator({ loading, label }) {
  if (!loading) return null

  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-40 flex w-48 items-center justify-center bg-gradient-to-l from-blue-50/95 to-transparent"
        role="status"
        aria-live="polite"
        aria-label={label ?? 'Loading more calendar data'}
      >
        <div className="flex flex-col items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-3 shadow-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-center text-xs font-medium text-blue-700">
            {label ?? 'Loading…'}
          </span>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-lg" role="status">
        {label ?? 'Loading next period…'}
      </div>
    </>
  )
}
