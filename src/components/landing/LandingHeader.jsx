function BlueprintLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">
        B
      </div>
      <span className="text-lg font-semibold text-gray-800">Blueprint</span>
    </div>
  )
}

function IconButton({ children, hasBadge }) {
  return (
    <button
      type="button"
      className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
    >
      {children}
      {hasBadge && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      )}
    </button>
  )
}

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <BlueprintLogo />

        <div className="flex items-center gap-1">
          <IconButton>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </IconButton>
          <IconButton>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </IconButton>
          <IconButton hasBadge>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </IconButton>
          <div className="ml-2 h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-pink-300 to-purple-400">
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-white">
              LB
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
