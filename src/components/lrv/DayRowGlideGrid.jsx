import { memo, useMemo } from 'react'
import { SLOT_HEIGHT, WEEK_COL_WIDTH, formatShortDate, getConflictRegions, getEventStyle, slotStart } from '../../utils/broadcastCalendar'
import CellSelectionLayer from './CellSelectionLayer'
import ConflictOverlay from './ConflictOverlay'
import EventBlock from './EventBlock'

const DayRowGlideGrid = memo(function DayRowGlideGrid({
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
  dragDraft,
  onDragDraftChange,
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
    if (w) onCellPointerDown(dayName, wi, ti, w.monday, slotStart(timeSlots[ti]), e)
  }

  const handleOverlayDoubleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const wi = Math.min(weeks.length - 1, Math.max(0, Math.floor((e.clientX - rect.left) / WEEK_COL_WIDTH)))
    const ti = Math.min(timeSlots.length - 1, Math.max(0, Math.floor((e.clientY - rect.top) / SLOT_HEIGHT)))
    const w = weeks[wi]
    if (w) onCellDoubleClick(dayName, w.monday, slotStart(timeSlots[ti]))
  }

  if (weeks.length === 0 || timeSlots.length === 0) return null

  return (
    <div className="relative" style={{ width: baseGridWidth, height: dayRowHeight + 18 }}>
      {weeks.map((w, wi) => (
        <div
          key={`grid-v-${wi}-${w.monday}`}
          className="absolute top-0 border-r border-gray-200"
          style={{ left: wi * WEEK_COL_WIDTH, width: WEEK_COL_WIDTH, height: dayRowHeight }}
        />
      ))}
      {timeSlots.map((slot, ti) => (
        <div
          key={`grid-h-${dayName}-${slotStart(slot)}`}
          className="absolute left-0 w-full border-b border-gray-200"
          style={{ top: ti * SLOT_HEIGHT, height: SLOT_HEIGHT }}
        />
      ))}

      <div
        data-day-grid
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

      {dragDraft?.dayName === dayName && (() => {
        const { _sourceDayName, ...ghostEvent } = dragDraft
        const pos = getEventStyle(ghostEvent, weeks, dayPart, dayName)
        if (!pos) return null
        return (
          <EventBlock
            key={`ghost-${dragDraft.id}`}
            event={ghostEvent}
            isGhost
            weeks={weeks}
            dayPart={dayPart}
            dayName={dayName}
            timeSlots={timeSlots}
            allEvents={allEvents}
            baseStyle={pos}
            onSelect={onEventSelect}
            onUpdate={onEventUpdate}
            onDraftChange={onDragDraftChange}
            onDoubleClick={onEventDoubleClick}
            onContextMenu={onEventContextMenu}
          />
        )
      })()}

      {dayEvents.map((evt) => {
        if (dragDraft?.id === evt.id) return null
        const pos = getEventStyle(evt, weeks, dayPart, dayName)
        if (!pos) return null
        return (
          <EventBlock
            key={evt.id}
            event={evt}
            weeks={weeks}
            dayPart={dayPart}
            dayName={dayName}
            timeSlots={timeSlots}
            allEvents={allEvents}
            baseStyle={pos}
            onSelect={onEventSelect}
            onUpdate={onEventUpdate}
            onDraftChange={onDragDraftChange}
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

export default DayRowGlideGrid
