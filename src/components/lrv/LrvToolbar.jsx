import UserPresenceBar from './UserPresenceBar'

export default function LrvToolbar({
  dayParts,
  selectedDayPart,
  onDayPartChange,
  tooltipEnabled,
  onTooltipToggle,
  onNavigateHome,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onCreateEvent,
  activeUsers,
  currentUserId,
  sessionCount,
}) {
  const selected = dayParts.find((d) => d.id === selectedDayPart)

  return (
    <div className="shrink-0 border-b border-gray-200 bg-white text-gray-800">
      <div className="flex flex-wrap items-center gap-2 px-4 py-2">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-sm font-bold text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Glide Data Grid · LRV Grid
        </button>

        <div className="flex items-center gap-0.5 text-gray-500">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            className="rounded p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            className="rounded p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
          </button>
          <button type="button" aria-label="Search" className="rounded p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button type="button" onClick={onCreateEvent} aria-label="Open calendar" className="rounded p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Day Part :</span>
          <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 font-medium text-gray-700">
            {selected?.name ?? 'Prime Time (8:00-12:00 PM)'}
          </span>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-600">
          <span>Tooltip</span>
          <button
            type="button"
            role="switch"
            aria-checked={tooltipEnabled}
            onClick={onTooltipToggle}
            className={`relative h-5 w-9 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${tooltipEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${tooltipEnabled ? 'left-4' : 'left-0.5'}`} />
          </button>
        </label>

        <div className="ml-auto flex items-center gap-3">
          <button type="button" aria-label="History" className="rounded p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button type="button" aria-label="Versions" className="rounded p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          {activeUsers && (
            <UserPresenceBar
              activeUsers={activeUsers}
              currentUserId={currentUserId}
              sessionCount={sessionCount}
            />
          )}
        </div>
      </div>

      {selected && (
        <div className="border-t border-gray-100 px-4 py-0.5 text-[10px] text-gray-400">
          Showing: {selected.name}
        </div>
      )}
    </div>
  )
}
