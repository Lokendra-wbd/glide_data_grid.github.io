import { memo, useMemo } from 'react'
import {
  WEEK_COL_WIDTH,
  EVENT_TITLE_HEIGHT,
  SLOT_HEIGHT,
  getEventSlotCount,
  getEventStyle,
  getSegmentsByWeek,
  getConflictWeekIndices,
} from '../../utils/broadcastCalendar'
import { useEventDrag } from '../../hooks/useEventDrag'

function lightenColor(hex, amount = 0.35) {
  if (!hex || !hex.startsWith('#')) return '#b8d4f0'
  const num = parseInt(hex.slice(1), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * amount))
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount))
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount))
  return `rgb(${r},${g},${b})`
}

function darkenColor(hex) {
  if (!hex || !hex.startsWith('#')) return '#1e3a8a'
  const num = parseInt(hex.slice(1), 16)
  const r = Math.max(0, ((num >> 16) & 0xff) - 40)
  const g = Math.max(0, ((num >> 8) & 0xff) - 40)
  const b = Math.max(0, (num & 0xff) - 40)
  return `rgb(${r},${g},${b})`
}

function EventBlockInner({
  event,
  isGhost = false,
  baseStyle,
  weeks,
  dayPart,
  dayName,
  timeSlots,
  allEvents,
  onSelect,
  onUpdate,
  onDraftChange,
  onDoubleClick,
  onContextMenu,
}) {
  const display = event
  const displayDay = display.dayName

  const hasConflict = useMemo(
    () => getConflictWeekIndices(display, allEvents, weeks, displayDay).size > 0,
    [display, allEvents, weeks, displayDay],
  )

  const { handlePointerDown, isLocked } = useEventDrag({
    event,
    dayPart,
    weeks,
    timeSlots,
    onUpdate,
    onDraftChange,
    hasConflict,
  })

  const style = getEventStyle(display, weeks, dayPart, displayDay) ?? baseStyle
  const segmentsByWeek = useMemo(
    () => getSegmentsByWeek(display, weeks, displayDay),
    [display, weeks, displayDay],
  )
  const conflictWeeks = useMemo(
    () => getConflictWeekIndices(display, allEvents, weeks, displayDay),
    [display, allEvents, weeks, displayDay],
  )

  const slotCount = getEventSlotCount(display)
  const weekCount = segmentsByWeek.length
  const isSingleSlot = slotCount === 1
  const isSingleWeek = weekCount === 1
  const showCompact = isSingleSlot && isSingleWeek

  const titleHeight = EVENT_TITLE_HEIGHT
  const titleBg = lightenColor(display.color)
  const episodeTextColor = darkenColor(display.color)
  const episodeRowHeight = isSingleSlot ? Math.max(SLOT_HEIGHT - titleHeight, EVENT_TITLE_HEIGHT) : SLOT_HEIGHT

  if (!style || displayDay !== dayName) return null

  return (
    <div
      role="button"
      tabIndex={isGhost ? -1 : 0}
      aria-label={`${display.title}, ${display.startTime} to ${display.endTime}${isLocked ? ', locked' : ''}`}
      aria-hidden={isGhost}
      className={`group absolute flex flex-col overflow-hidden border shadow-sm focus:outline-none ${
        isGhost
          ? 'pointer-events-none z-[30] opacity-90 ring-2 ring-blue-400'
          : `focus:ring-2 focus:ring-blue-400 ${isLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`
      } ${hasConflict ? 'border-red-400' : 'border-gray-300'}`}
      style={{ ...style, backgroundColor: titleBg, zIndex: isGhost ? 30 : 15 }}
      onClick={isGhost ? undefined : (e) => {
        e.stopPropagation()
        onSelect({ ...display, hasConflict }, { x: e.clientX, y: e.clientY })
      }}
      onDoubleClick={isGhost ? undefined : (e) => {
        e.stopPropagation()
        onDoubleClick({ ...display, hasConflict })
      }}
      onContextMenu={isGhost ? undefined : (e) => {
        e.preventDefault()
        e.stopPropagation()
        onContextMenu({ ...display, hasConflict }, { x: e.clientX, y: e.clientY })
      }}
      onKeyDown={isGhost ? undefined : (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const rect = e.currentTarget.getBoundingClientRect()
          onSelect({ ...display, hasConflict }, { x: rect.left, y: rect.bottom })
        }
      }}
      onPointerDown={isGhost || isLocked ? undefined : (e) => handlePointerDown(e, 'move')}
    >
      {!isGhost && !isLocked && (
        <>
          <div
            className="absolute left-0 top-0 z-10 h-full w-2 cursor-ew-resize touch-none opacity-0 group-hover:opacity-100"
            onPointerDown={(e) => handlePointerDown(e, 'resize-left')}
          />
          <div
            className="absolute right-0 top-0 z-10 h-full w-2 cursor-ew-resize touch-none opacity-0 group-hover:opacity-100"
            onPointerDown={(e) => handlePointerDown(e, 'resize-right')}
          />
          <div
            className="absolute left-2 right-2 top-0 z-10 h-2 cursor-ns-resize touch-none opacity-0 group-hover:opacity-100"
            onPointerDown={(e) => handlePointerDown(e, 'resize-top')}
          />
          <div
            className="absolute bottom-0 left-2 right-2 z-10 h-2 cursor-ns-resize touch-none opacity-0 group-hover:opacity-100"
            onPointerDown={(e) => handlePointerDown(e, 'resize-bottom')}
          />
        </>
      )}

      {showCompact ? (
        <div className="flex h-full flex-col overflow-hidden">
          <div
            className="flex shrink-0 items-center justify-center truncate px-1 text-center text-[9px] font-bold leading-tight"
            style={{ height: titleHeight, color: episodeTextColor }}
            title={display.title}
          >
            {display.title}
          </div>
          <div
            className="flex flex-1 items-center justify-center bg-white/45 text-[11px] font-semibold"
            style={{ color: episodeTextColor }}
          >
            {segmentsByWeek[0]?.segment ?? '—'}
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          <div
            className="shrink-0 truncate border-b border-white/50 px-2 text-center text-[11px] font-bold"
            style={{
              height: titleHeight,
              lineHeight: `${titleHeight}px`,
              color: episodeTextColor,
            }}
          >
            {display.title}
          </div>

          {slotCount > 1 && <div className="min-h-0 flex-1" aria-hidden="true" />}

          <div className="flex shrink-0" style={{ height: episodeRowHeight }}>
            {segmentsByWeek.map(({ weekIndex, segment }) => {
              const isConflictCol = conflictWeeks.has(weekIndex)
              return (
                <div
                  key={`seg-${event.id}-${weekIndex}`}
                  className={`flex shrink-0 items-center justify-center border-r border-white/60 bg-white/45 text-[11px] font-semibold last:border-r-0 ${
                    isConflictCol ? 'ring-1 ring-inset ring-red-400' : ''
                  }`}
                  style={{ width: WEEK_COL_WIDTH, minWidth: WEEK_COL_WIDTH, color: episodeTextColor }}
                >
                  {segment ?? '—'}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {(display.warning || display.predefined) && (
        <span
          className="pointer-events-none absolute right-0 top-0 z-20"
          style={{
            width: 0,
            height: 0,
            borderTop: `8px solid ${display.predefined ? '#64748b' : '#dc2626'}`,
            borderLeft: '8px solid transparent',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

const EventBlock = memo(EventBlockInner, (prev, next) =>
  prev.event === next.event
  && prev.isGhost === next.isGhost
  && prev.baseStyle === next.baseStyle
  && prev.weeks === next.weeks
  && prev.dayPart === next.dayPart
  && prev.dayName === next.dayName
  && prev.timeSlots === next.timeSlots
  && prev.allEvents === next.allEvents,
)

export default EventBlock
