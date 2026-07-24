export default function LrvFooter({ legendItems, expanded, onToggle }) {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-full items-center gap-3">
        <span className="shrink-0 text-sm font-semibold text-gray-800">Hours Count :</span>

        <div className="flex flex-wrap items-center gap-2">
          {legendItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-200"
            >
              <span style={{ color: item.color }}>{item.label}</span>
              {item.count !== null && (
                <span className="rounded-full bg-gray-500 px-2 py-0.5 text-xs text-white">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="ml-auto shrink-0 text-gray-500 hover:text-gray-700"
          aria-label={expanded ? 'Collapse footer' : 'Expand footer'}
        >
          <svg
            className={`h-4 w-4 transition-transform ${expanded ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
