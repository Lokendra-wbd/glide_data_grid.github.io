import { useCallback, useRef } from 'react'
import {
  SLOT_HEIGHT,
  WEEK_COL_WIDTH,
  getWeekColRange,
  minutesToTime,
  slotStart,
  snapToSlot,
  timeToMinutes,
} from '../utils/broadcastCalendar'

function clampTimeRange(startMins, duration, partStart, partEnd) {
  const maxStart = partEnd - duration
  const clampedStart = Math.max(partStart, Math.min(maxStart, startMins))
  return {
    startTime: minutesToTime(snapToSlot(clampedStart)),
    endTime: minutesToTime(snapToSlot(clampedStart + duration)),
  }
}

function resolveDropTarget(clientX, clientY, weeks, timeSlots) {
  const rows = document.querySelectorAll('[data-day-row]')
  for (const dayRow of rows) {
    const dayName = dayRow.getAttribute('data-day-row')
    const grid = dayRow.querySelector('[data-day-grid]')
    if (!dayName || !grid) continue

    const rect = grid.getBoundingClientRect()
    if (
      clientX < rect.left
      || clientX > rect.right
      || clientY < rect.top
      || clientY > rect.bottom
    ) {
      continue
    }

    const weekIndex = Math.min(
      weeks.length - 1,
      Math.max(0, Math.floor((clientX - rect.left) / WEEK_COL_WIDTH)),
    )
    const timeIndex = Math.min(
      timeSlots.length - 1,
      Math.max(0, Math.floor((clientY - rect.top) / SLOT_HEIGHT)),
    )

    return {
      dayName,
      weekIndex,
      timeIndex,
      time: slotStart(timeSlots[timeIndex]),
    }
  }
  return null
}

function draftEquals(a, b) {
  if (!a || !b) return false
  return (
    a.dayName === b.dayName
    && a.startDate === b.startDate
    && a.endDate === b.endDate
    && a.startTime === b.startTime
    && a.endTime === b.endTime
  )
}

export function useEventDrag({
  event,
  dayPart,
  weeks,
  timeSlots,
  onUpdate,
  onDraftChange,
  hasConflict,
}) {
  const dragRef = useRef(null)
  const lastDraftRef = useRef(null)

  const handlePointerDown = useCallback(
    (e, mode) => {
      if (event.predefined) return

      e.stopPropagation()
      e.preventDefault()
      if (e.currentTarget.setPointerCapture) {
        e.currentTarget.setPointerCapture(e.pointerId)
      }

      dragRef.current = {
        mode,
        pointerId: e.pointerId,
        origDayName: event.dayName,
        origStartDate: event.startDate,
        origEndDate: event.endDate,
        origStartTime: event.startTime,
        origEndTime: event.endTime,
      }
      lastDraftRef.current = event
      onDraftChange?.({ ...event, _sourceDayName: event.dayName })

      const partStart = timeToMinutes(dayPart.start)
      const partEnd = timeToMinutes(dayPart.end)

      const onMove = (ev) => {
        const drag = dragRef.current
        if (!drag || ev.pointerId !== drag.pointerId) return

        let next = { ...event, _sourceDayName: drag.origDayName }

        if (drag.mode === 'move') {
          const target = resolveDropTarget(ev.clientX, ev.clientY, weeks, timeSlots)
          if (!target) return

          const origCols = getWeekColRange(
            weeks,
            drag.origStartDate,
            drag.origEndDate,
            drag.origDayName,
          )
          if (origCols.startCol === -1) return

          const weekSpan = origCols.endCol - origCols.startCol
          const newStartCol = Math.min(
            weeks.length - 1 - weekSpan,
            Math.max(0, target.weekIndex),
          )
          const newEndCol = newStartCol + weekSpan
          const duration = timeToMinutes(drag.origEndTime) - timeToMinutes(drag.origStartTime)
          const times = clampTimeRange(timeToMinutes(target.time), duration, partStart, partEnd)

          next = {
            ...next,
            dayName: target.dayName,
            startDate: weeks[newStartCol].dates[target.dayName],
            endDate: weeks[newEndCol].dates[target.dayName],
            ...times,
          }
        } else if (drag.mode === 'resize-left') {
          const target = resolveDropTarget(ev.clientX, ev.clientY, weeks, timeSlots)
          if (!target || target.dayName !== drag.origDayName) return
          const current = lastDraftRef.current ?? event
          const cols = getWeekColRange(weeks, current.startDate, current.endDate, drag.origDayName)
          if (cols.endCol === -1) return
          const clampedStart = Math.min(target.weekIndex, cols.endCol)
          next = {
            ...current,
            _sourceDayName: drag.origDayName,
            startDate: weeks[clampedStart].dates[drag.origDayName],
          }
        } else if (drag.mode === 'resize-right') {
          const target = resolveDropTarget(ev.clientX, ev.clientY, weeks, timeSlots)
          if (!target || target.dayName !== drag.origDayName) return
          const current = lastDraftRef.current ?? event
          const cols = getWeekColRange(weeks, current.startDate, current.endDate, drag.origDayName)
          if (cols.startCol === -1) return
          const clampedEnd = Math.max(target.weekIndex, cols.startCol)
          next = {
            ...current,
            _sourceDayName: drag.origDayName,
            endDate: weeks[clampedEnd].dates[drag.origDayName],
          }
        } else if (drag.mode === 'resize-top') {
          const target = resolveDropTarget(ev.clientX, ev.clientY, weeks, timeSlots)
          if (!target || target.dayName !== drag.origDayName) return
          const endMins = timeToMinutes(drag.origEndTime)
          let newStartMins = snapToSlot(timeToMinutes(target.time))
          newStartMins = Math.max(partStart, Math.min(endMins - 30, newStartMins))
          next = {
            ...(lastDraftRef.current ?? event),
            _sourceDayName: drag.origDayName,
            startTime: minutesToTime(newStartMins),
          }
        } else if (drag.mode === 'resize-bottom') {
          const target = resolveDropTarget(ev.clientX, ev.clientY, weeks, timeSlots)
          if (!target || target.dayName !== drag.origDayName) return
          const startMins = timeToMinutes(drag.origStartTime)
          let newEndMins = snapToSlot(timeToMinutes(target.time) + 30)
          newEndMins = Math.max(startMins + 30, Math.min(partEnd, newEndMins))
          next = {
            ...(lastDraftRef.current ?? event),
            _sourceDayName: drag.origDayName,
            endTime: minutesToTime(newEndMins),
          }
        }

        if (!draftEquals(next, lastDraftRef.current)) {
          lastDraftRef.current = next
          onDraftChange?.(next)
        }
      }

      const onUp = (ev) => {
        const drag = dragRef.current
        if (!drag || ev.pointerId !== drag.pointerId) return
        dragRef.current = null

        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onUp)

        const finalEvent = lastDraftRef.current
        lastDraftRef.current = null
        if (finalEvent) {
          const { _sourceDayName, ...committed } = finalEvent
          onUpdate({ ...committed, hasConflict })
        }
        onDraftChange?.(null)
      }

      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
      document.addEventListener('pointercancel', onUp)
    },
    [event, dayPart, weeks, timeSlots, onUpdate, onDraftChange, hasConflict],
  )

  return { handlePointerDown, isLocked: !!event.predefined }
}
