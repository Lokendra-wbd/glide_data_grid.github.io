import { useNavigate } from 'react-router-dom'

export default function LrvHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-[9px] font-bold text-white" aria-hidden="true">WB</div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white" aria-hidden="true">F</div>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-haspopup="listbox"
        >
          Food 2028 V.2.3
          <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Help" className="rounded p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button type="button" aria-label="Notifications" className="relative rounded p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>
    </header>
  )
}
