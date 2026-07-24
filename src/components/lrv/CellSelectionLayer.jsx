import { WEEK_COL_WIDTH, SLOT_HEIGHT, findSlotIndex, slotEnd, slotStart } from '../../utils/broadcastCalendar'

function UserBadge({ initials, color, style }) {
  return (
    <div
      className="absolute z-30 flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white shadow-md"
      style={{ backgroundColor: color, ...style }}
      title={initials}
    >
      {initials}
    </div>
  )
}

export default function CellSelectionLayer({
  peerSelections,
  currentUser,
  userSelection,
  dragSelection,
  weeks,
  dayName,
  timeSlots,
  metrics,
}) {
  const colW = metrics?.weekColWidth ?? WEEK_COL_WIDTH
  const slotH = metrics?.slotHeight ?? SLOT_HEIGHT
  const items = []

  peerSelections
    .filter((s) => s.dayName === dayName && s.weekMonday)
    .forEach((sel) => {
      const ti = findSlotIndex(timeSlots, sel.timeSlot)
      if (ti < 0) return
      const wi = weeks.findIndex((w) => w.monday === sel.weekMonday)
      if (wi < 0) return
      const ringColor = sel.ringColor ?? sel.color ?? '#a855f7'

      items.push(
        <div
          key={`peer-${sel.userId}-${wi}-${sel.timeSlot}`}
          className="pointer-events-none absolute rounded-sm"
          style={{
            left: wi * colW,
            top: ti * slotH,
            width: colW,
            height: slotH,
            boxShadow: `inset 0 0 0 2px ${ringColor}`,
            backgroundColor: `${ringColor}18`,
          }}
        >
          <UserBadge
            initials={sel.initials ?? sel.userId?.toUpperCase()}
            color={sel.color ?? '#9333ea'}
            style={{ top: -8, left: '50%', transform: 'translateX(-50%)' }}
          />
        </div>,
      )
    })

  if (userSelection?.dayName === dayName) {
    const { startWeekIndex, endWeekIndex, startTimeIndex, endTimeIndex } = userSelection
    const left = Math.min(startWeekIndex, endWeekIndex) * colW
    const width = (Math.abs(endWeekIndex - startWeekIndex) + 1) * colW
    const top = Math.min(startTimeIndex, endTimeIndex) * slotH
    const height = (Math.abs(endTimeIndex - startTimeIndex) + 1) * slotH

    items.push(
      <div
        key="user-selection"
        className="pointer-events-none absolute rounded-sm"
        style={{
          left,
          top,
          width,
          height,
          boxShadow: `inset 0 0 0 2px ${currentUser.ringColor}`,
          backgroundColor: `${currentUser.ringColor}22`,
        }}
      >
        <UserBadge
          initials={currentUser.initials}
          color={currentUser.color}
          style={{ top: -8, left: 8 }}
        />
      </div>,
    )
  }

  if (dragSelection?.dayName === dayName && dragSelection.active) {
    const { startWeekIndex, endWeekIndex, startTimeIndex, endTimeIndex } = dragSelection
    const left = Math.min(startWeekIndex, endWeekIndex) * colW
    const width = (Math.abs(endWeekIndex - startWeekIndex) + 1) * colW
    const top = Math.min(startTimeIndex, endTimeIndex) * slotH
    const height = (Math.abs(endTimeIndex - startTimeIndex) + 1) * slotH

    items.push(
      <div
        key="drag-selection"
        className="pointer-events-none absolute z-[40] rounded-sm border-2 border-dashed border-purple-500 bg-purple-200/50 shadow-[inset_0_0_0_1px_rgba(147,51,234,0.3)]"
        style={{ left, top, width, height }}
      />,
    )
  }

  return <>{items}</>
}

export function SelectionActionBar({ selection, weeks, dayName, timeSlots, onCreate, onClear }) {
  if (!selection || selection.startWeekIndex === undefined) return null

  const startWi = Math.min(selection.startWeekIndex, selection.endWeekIndex)
  const endWi = Math.max(selection.startWeekIndex, selection.endWeekIndex)
  const startTi = Math.min(selection.startTimeIndex, selection.endTimeIndex)
  const endTi = Math.max(selection.startTimeIndex, selection.endTimeIndex)
  const weekCount = endWi - startWi + 1
  const slotCount = endTi - startTi + 1
  const startDate = weeks[startWi]?.dates?.[dayName]
  const endDate = weeks[endWi]?.dates?.[dayName]
  const startTime = slotStart(timeSlots[startTi])
  const endTime = slotEnd(timeSlots[endTi])

  return (
    <div className="absolute bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-purple-300 bg-white px-4 py-2 shadow-lg">
      <span className="text-xs text-gray-600">
        {weekCount} week{weekCount > 1 ? 's' : ''} &times; {slotCount * 30} min
        {startDate && endDate && ` (${startDate} – ${endDate})`}
      </span>
      <button
        type="button"
        onClick={() => onCreate({ dayName, startDate, endDate, startTime, endTime, weekCount, slotCount })}
        className="rounded bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-500"
      >
        Create Event
      </button>
      <button type="button" onClick={onClear} className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
        Clear
      </button>
    </div>
  )
}
