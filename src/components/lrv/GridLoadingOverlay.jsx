export default function GridLoadingOverlay({ message, subtext }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-8 py-6 shadow-lg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" role="status" />
        <p className="text-sm font-medium text-gray-800">{message ?? 'Loading schedule…'}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
  )
}
