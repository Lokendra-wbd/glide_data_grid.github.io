export default function EventTooltip({ event, position, onClose }) {
  if (!event || !position) return null

  const tooltipWidth = 288
  const tooltipHeight = 220
  const padding = 12
  const left = Math.min(position.x + 12, window.innerWidth - tooltipWidth - padding)
  const top = Math.min(position.y + 12, window.innerHeight - tooltipHeight - padding)

  return (
    <div
      role="tooltip"
      aria-live="polite"
      className="pointer-events-auto fixed z-50 w-72 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm"
      style={{ left: Math.max(padding, left), top: Math.max(padding, top) }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close tooltip"
        className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        &times;
      </button>

      <h4 className="pr-8 text-base font-semibold text-gray-900">{event.title}</h4>

      <dl className="mt-2 space-y-1 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Day</dt>
          <dd>{event.dayName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Dates</dt>
          <dd>{event.startDate} – {event.endDate}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Time</dt>
          <dd>{event.startTime} – {event.endTime}</dd>
        </div>
      </dl>

      {event.segments?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500">Episodes</p>
          <p className="mt-1 max-h-24 overflow-y-auto text-sm leading-relaxed text-gray-700">
            {event.segments.join(', ')}
          </p>
        </div>
      )}

      {event.hasConflict && (
        <p className="mt-3 rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700">
          Schedule conflict detected in overlapping weeks
        </p>
      )}
    </div>
  )
}
