import { useCallback, useEffect, useMemo, useRef, useState, useDeferredValue } from 'react'
import {
  DAY_LABEL_WIDTH,
  DAY_NAMES,
  SLOT_HEIGHT,
  TIME_LABEL_WIDTH,
  WEEK_COL_WIDTH,
  ZOOM_STEP,
  clampZoom,
  estimateGridWidth,
  estimateWeekCountForQuarters,
  generateTimeSlots,
  getDateForDay,
  getNextQuarter,
  getZoomMetrics,
  mergeWeeks,
  generateWeeksForQuarter,
} from '../../utils/broadcastCalendar'
import { fetchQuarterWeeks } from '../../api/mockApi'
import { getQuarterYearLabel } from '../../api/bulkDataGenerator'
import { getDataConfigLabel } from '../../config/env'
import { useCollaboration } from '../../hooks/useCollaboration'
import { useGridSelection } from '../../hooks/useGridSelection'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectEventsLoading } from '../../store/slices/eventsSlice'
import {
  addLoadedQuarter,
  clearConfirmedSelection,
  selectConfirmedSelection,
  selectDragSelection,
  selectLoadingLabel,
  selectQuarterLoading,
  selectUi,
  setQuarterLoading,
  setSelectedMonday,
  setSelectedQuarter,
  setZoom,
} from '../../store/slices/uiSlice'
import CalendarHeader from './CalendarHeader'
import DayRowGlideGrid from './DayRowGlideGrid'
import TimeSlotLabels from './TimeSlotLabels'
import { SelectionActionBar } from './CellSelectionLayer'
import GridLoadingOverlay from './GridLoadingOverlay'
import ScrollLoadingIndicator from './ScrollLoadingIndicator'

export default function BroadcastCalendar({
  events,
  dayPart,
  onEventSelect,
  onEventUpdate,
  onEventDoubleClick,
  onEventContextMenu,
  onCreateEvent,
  activeUsers,
  currentUser,
}) {
  const dispatch = useAppDispatch()
  const ui = useAppSelector(selectUi)
  const dragSelection = useAppSelector(selectDragSelection)
  const confirmedSelection = useAppSelector(selectConfirmedSelection)
  const quarterLoading = useAppSelector(selectQuarterLoading)
  const loadingLabel = useAppSelector(selectLoadingLabel)
  const eventsLoading = useAppSelector(selectEventsLoading)

  const deferredEvents = useDeferredValue(events)

  const scrollRef = useRef(null)
  const [weeks, setWeeks] = useState(() =>
    mergeWeeks(ui.loadedQuarters.map((q) => generateWeeksForQuarter(q))),
  )
  const [weeksLoading, setWeeksLoading] = useState(false)
  const metrics = useMemo(() => getZoomMetrics(ui.zoom), [ui.zoom])
  const { peerSelections } = useCollaboration(weeks, activeUsers, currentUser)
  const [dragDraft, setDragDraft] = useState(null)
  const timeSlots = generateTimeSlots(dayPart.start, dayPart.end)
  const dayRowHeight = timeSlots.length * SLOT_HEIGHT
  const { handleCellMouseDown } = useGridSelection(weeks, timeSlots)

  const eventsByDay = useMemo(() => {
    const map = Object.fromEntries(DAY_NAMES.map((d) => [d, []]))
    for (const e of deferredEvents) {
      if (map[e.dayName]) map[e.dayName].push(e)
    }
    return map
  }, [deferredEvents])

  const dataConfig = useMemo(() => getDataConfigLabel(), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setWeeksLoading(true)
      const quarterWeeks = []
      for (const q of ui.loadedQuarters) {
        quarterWeeks.push(await fetchQuarterWeeks(q))
      }
      if (!cancelled) {
        setWeeks(mergeWeeks(quarterWeeks))
        setWeeksLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [ui.loadedQuarters])

  const baseWidth = DAY_LABEL_WIDTH + TIME_LABEL_WIDTH + weeks.length * WEEK_COL_WIDTH
  const baseGridWidth = weeks.length * WEEK_COL_WIDTH
  const scaledWidth = weeks.length > 0
    ? baseWidth * metrics.zoom
    : estimateGridWidth(ui.loadedQuarters, metrics.zoom)
  const isGridLoading = weeksLoading || eventsLoading
  const showGrid = ui.loadedQuarters.length > 0

  const handleScroll = useCallback(async () => {
    const el = scrollRef.current
    if (!el || quarterLoading || ui.loadedQuarters.length === 0) return
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 400
    if (nearEnd) {
      const lastQ = ui.loadedQuarters[ui.loadedQuarters.length - 1]
      const nextQ = getNextQuarter(lastQ)
      if (!ui.loadedQuarters.includes(nextQ)) {
        const year = getQuarterYearLabel(nextQ)
        dispatch(setQuarterLoading({ loading: true, label: `Loading ${nextQ} (${year})…` }))
        dispatch(addLoadedQuarter(nextQ))
      }
    }
  }, [ui.loadedQuarters, quarterLoading, dispatch])

  const handleCellDoubleClick = useCallback((dayName, weekMonday, time) => {
    const date = getDateForDay(weekMonday, dayName)
    const [h, m] = time.split(':').map(Number)
    const endMins = h * 60 + m + 30
    const endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`
    onCreateEvent({ dayName, startDate: date, endDate: date, startTime: time, endTime })
  }, [onCreateEvent])

  const handleSelectionCreate = (defaults) => {
    onCreateEvent(defaults)
    dispatch(clearConfirmedSelection())
  }

  const selectionDay = confirmedSelection?.dayName

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {isGridLoading && (
        <GridLoadingOverlay
          message="Loading schedule data…"
          subtext={`${ui.loadedQuarters.join(', ')} · max ${dataConfig.maxEvents} events · Glide Data Grid`}
        />
      )}

      <ScrollLoadingIndicator loading={quarterLoading} label={loadingLabel} />

      <div
        ref={scrollRef}
        className="lrv-grid-scroll flex-1 overflow-x-scroll overflow-y-auto"
        onScroll={handleScroll}
        role="grid"
        aria-label="Broadcast schedule grid"
        aria-busy={isGridLoading}
      >
        {showGrid && (
          <div style={{ width: scaledWidth, minWidth: scaledWidth }}>
            <div
              style={{
                transform: `scale(${metrics.zoom})`,
                transformOrigin: 'top left',
                width: baseWidth,
              }}
            >
              <div className="sticky top-0 z-30 bg-[#fafafa]">
                <CalendarHeader
                  weeks={weeks}
                  selectedMonday={ui.selectedMonday}
                  selectedQuarter={ui.selectedQuarter}
                  onSelectWeek={(m) => dispatch(setSelectedMonday(m))}
                  onSelectQuarter={(q) => dispatch(setSelectedQuarter(q))}
                  scrollRef={scrollRef}
                  zoom={metrics.zoom}
                  placeholderWeekCount={weeks.length ? 0 : estimateWeekCountForQuarters(ui.loadedQuarters)}
                />
              </div>

              {DAY_NAMES.map((dayName) => (
                <div key={dayName} data-day-row={dayName} className="flex border-b border-gray-300" role="row">
                  <div
                    className="sticky left-0 z-20 flex shrink-0 border-r border-gray-300 bg-white"
                    style={{ width: DAY_LABEL_WIDTH + TIME_LABEL_WIDTH }}
                    role="rowheader"
                  >
                    <div
                      className="flex items-center justify-center border-r border-gray-200 bg-[#f3f4f6] text-[11px] font-semibold tracking-wide text-gray-600"
                      style={{ width: DAY_LABEL_WIDTH, height: dayRowHeight, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {dayName}
                    </div>
                    <TimeSlotLabels dayName={dayName} timeSlots={timeSlots} />
                  </div>

                  <DayRowGlideGrid
                    dayName={dayName}
                    dayEvents={eventsByDay[dayName]}
                    allEvents={deferredEvents}
                    weeks={weeks}
                    dayPart={dayPart}
                    timeSlots={timeSlots}
                    dayRowHeight={dayRowHeight}
                    baseGridWidth={baseGridWidth}
                    peerSelections={peerSelections}
                    currentUser={currentUser}
                    confirmedSelection={confirmedSelection}
                    dragSelection={dragSelection}
                    dragDraft={dragDraft}
                    onDragDraftChange={setDragDraft}
                    onCellPointerDown={handleCellMouseDown}
                    onCellDoubleClick={handleCellDoubleClick}
                    onEventSelect={onEventSelect}
                    onEventUpdate={onEventUpdate}
                    onEventDoubleClick={onEventDoubleClick}
                    onEventContextMenu={onEventContextMenu}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {confirmedSelection && selectionDay && (
        <SelectionActionBar
          selection={confirmedSelection}
          weeks={weeks}
          dayName={selectionDay}
          timeSlots={timeSlots}
          onCreate={handleSelectionCreate}
          onClear={() => dispatch(clearConfirmedSelection())}
        />
      )}

      <div className="absolute bottom-4 right-4 z-50 flex flex-col rounded border border-gray-300 bg-white shadow" role="group" aria-label="Zoom controls">
        <button
          type="button"
          aria-label="Zoom in"
          disabled={metrics.zoom >= 1.75}
          onClick={() => dispatch(setZoom(clampZoom(ui.zoom + ZOOM_STEP)))}
          className="px-2 py-1 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          disabled={metrics.zoom <= 0.75}
          onClick={() => dispatch(setZoom(clampZoom(ui.zoom - ZOOM_STEP)))}
          className="border-t border-gray-200 px-2 py-1 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <div className="border-t border-gray-200 px-2 py-0.5 text-center text-[9px] text-gray-500">
          {Math.round(metrics.zoom * 100)}%
        </div>
      </div>
    </div>
  )
}
