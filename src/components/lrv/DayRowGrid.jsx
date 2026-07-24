import { memo, useMemo } from 'react'
import { SLOT_HEIGHT, WEEK_COL_WIDTH, formatShortDate, getConflictRegions, getEventStyle } from '../../utils/broadcastCalendar'
import CellSelectionLayer from './CellSelectionLayer'
import ConflictOverlay from './ConflictOverlay'
import EventBlock from './EventBlock'

const DayRowGrid = memo(function DayRowGrid({
  dayName,
  dayEvents,
  allEvents,
  weeks,
  dayPart,
  timeSlots,
  dayRowHeight,
  baseGridWidth,
  peerSelections,
  currentUser,
  confirmedSelection,
  dragSelection,
  onCellPointerDown,
  onCellDoubleClick,
  onEventSelect,
  onEventUpdate,
  onEventDoubleClick,
  onEventContextMenu,
}) {
  const conflictRegions = useMemo(
    () => getConflictRegions(allEvents, weeks, dayName, dayPart),
    [allEvents, weeks, dayName, dayPart],
  )

  const handleOverlayPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const wi = Math.min(weeks.length - 1, Math.max(0, Math.floor((e.clientX - rect.left) / WEEK_COL_WIDTH)))
    const ti = Math.min(timeSlots.length - 1, Math.max(0, Math.floor((e.clientY - rect.top) / SLOT_HEIGHT)))
    const w = weeks[wi]
    if (w) onCellPointerDown(dayName, wi, ti, w.monday, timeSlots[ti], e)
  }

  const handleOverlayDoubleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const wi = Math.min(weeks.length - 1, Math.max(0, Math.floor((e.clientX - rect.left) / WEEK_COL_WIDTH)))
    const ti = Math.min(timeSlots.length - 1, Math.max(0, Math.floor((e.clientY - rect.top) / SLOT_HEIGHT)))
    const w = weeks[wi]
    if (w) onCellDoubleClick(dayName, w.monday, timeSlots[ti])
  }

  return (
    <div className="relative" style={{ width: baseGridWidth, height: dayRowHeight + 18 }}>
      {weeks.map((w, wi) => (
        <div
          key={`grid-v-${wi}-${w.monday}`}
          className="absolute top-0 border-r border-gray-200"
          style={{ left: wi * WEEK_COL_WIDTH, width: WEEK_COL_WIDTH, height: dayRowHeight }}
        />
      ))}
      {timeSlots.map((time, ti) => (
        <div
          key={`grid-h-${dayName}-${time}`}
          className="absolute left-0 w-full border-b border-gray-100"
          style={{ top: ti * SLOT_HEIGHT, height: SLOT_HEIGHT }}
        />
      ))}

      <div
        className="absolute left-0 top-0 z-[5] touch-none"
        style={{ width: baseGridWidth, height: dayRowHeight }}
        onPointerDown={handleOverlayPointerDown}
        onDoubleClick={handleOverlayDoubleClick}
      />

      <div className="pointer-events-none absolute inset-0 z-[25]">
        <CellSelectionLayer
          peerSelections={peerSelections}
          currentUser={currentUser}
          userSelection={confirmedSelection?.dayName === dayName ? confirmedSelection : null}
          dragSelection={dragSelection?.dayName === dayName ? dragSelection : null}
          weeks={weeks}
          dayName={dayName}
          timeSlots={timeSlots}
        />
      </div>

      {conflictRegions.map((region) => (
        <ConflictOverlay key={region.id} region={region} />
      ))}

      {dayEvents.map((event) => {
        const pos = getEventStyle(event, weeks, dayPart, dayName)
        if (!pos) return null
        return (
          <EventBlock
            key={event.id}
            event={event}
            weeks={weeks}
            dayPart={dayPart}
            dayName={dayName}
            allEvents={allEvents}
            baseStyle={pos}
            onSelect={onEventSelect}
            onUpdate={onEventUpdate}
            onDoubleClick={onEventDoubleClick}
            onContextMenu={onEventContextMenu}
          />
        )
      })}

      <div className="absolute left-0 flex" style={{ top: dayRowHeight, width: baseGridWidth }}>
        {weeks.map((w, wi) => (
          <div
            key={`bot-${dayName}-${wi}-${w.monday}`}
            className="border-r border-gray-200 py-0.5 text-center text-[9px] text-gray-400"
            style={{ width: WEEK_COL_WIDTH }}
          >
            {formatShortDate(w.dates[dayName])}
          </div>
        ))}
      </div>
    </div>
  )
})

export default DayRowGrid
