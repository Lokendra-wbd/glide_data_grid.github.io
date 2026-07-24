function MiniGridPreview() {
  const bars = [
    { left: '8%', width: '35%', top: '20%', color: 'bg-yellow-400' },
    { left: '15%', width: '50%', top: '35%', color: 'bg-sky-300' },
    { left: '25%', width: '40%', top: '50%', color: 'bg-pink-300' },
    { left: '40%', width: '30%', top: '65%', color: 'bg-green-300' },
    { left: '55%', width: '25%', top: '30%', color: 'bg-yellow-400' },
    { left: '60%', width: '35%', top: '55%', color: 'bg-sky-300' },
  ]

  const dates = ['2/26', '3/4', '4/1', '4/8', '4/15', '4/22', '5/6']

  return (
    <div className="relative mb-4 h-36 overflow-hidden rounded-lg bg-gray-50">
      <div className="flex border-b border-gray-200 px-2 py-1">
        {dates.map((d) => (
          <span key={d} className="flex-1 text-center text-[9px] text-gray-400">
            {d}
          </span>
        ))}
      </div>
      <div className="relative h-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 top-6 border-l border-gray-200"
            style={{ left: `${(i / 7) * 100}%` }}
          />
        ))}
        <div className="absolute bottom-0 top-6 left-[57%] w-px bg-red-400" />
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`absolute h-4 rounded-sm ${bar.color} opacity-80`}
            style={{ left: bar.left, width: bar.width, top: bar.top }}
          />
        ))}
      </div>
    </div>
  )
}

function AvatarStack({ count }) {
  const colors = ['bg-pink-400', 'bg-blue-400', 'bg-green-400']
  return (
    <div className="flex items-center">
      {colors.slice(0, 2).map((color, i) => (
        <div
          key={i}
          className={`${color} -ml-1 h-7 w-7 rounded-full border-2 border-white first:ml-0`}
        />
      ))}
      {count > 0 && (
        <span className="ml-1 text-xs text-gray-500">+{count}</span>
      )}
    </div>
  )
}

export default function GridCard({ card, onClick }) {
  const isDisabled = !card.enabled

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`w-full rounded-2xl bg-white p-5 text-left shadow-lg transition ${
        isDisabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-blue-200'
      }`}
    >
      <MiniGridPreview />
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
          <p className="mt-1 text-sm text-gray-400">Last edited {card.lastEdited}</p>
          {isDisabled && (
            <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              Coming soon
            </span>
          )}
        </div>
        <AvatarStack count={card.extraCount} />
      </div>
    </button>
  )
}
