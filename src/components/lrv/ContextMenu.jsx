const MENU_ITEMS = [
  { id: 'copy', label: 'Copy', icon: 'copy' },
  { id: 'paste', label: 'Paste', icon: 'paste' },
  { id: 'add', label: 'Add to Grid', icon: 'add' },
  { id: 'bin', label: 'Move to Bin', icon: 'bin' },
  { id: 'delete', label: 'Delete', icon: 'delete', danger: true },
]

function MenuIcon({ type }) {
  const cls = 'h-4 w-4 text-gray-500'
  if (type === 'copy') {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  }
  if (type === 'paste') {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  }
  if (type === 'add') {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    )
  }
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

export default function ContextMenu({ position, onAction, onClose }) {
  if (!position) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose() }} />
      <div
        role="menu"
        aria-label="Event context menu"
        className="fixed z-50 min-w-[200px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
        style={{ left: position.x, top: position.y }}
      >
        <div className="border-b border-gray-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
          Right click menu
        </div>
        <div className="py-1">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            onClick={() => { onAction(item.id); onClose() }}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${item.danger ? 'text-red-600' : 'text-gray-700'}`}
          >
            <MenuIcon type={item.icon} />
            {item.label}
          </button>
        ))}
        </div>
      </div>
    </>
  )
}
