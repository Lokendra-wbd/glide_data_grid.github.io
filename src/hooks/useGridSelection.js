import { useCallback, useRef } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setDragSelection, clearDragSelection, setConfirmedSelection, clearConfirmedSelection } from '../store/slices/uiSlice'

export function useGridSelection(weeks, timeSlots) {
  const dispatch = useAppDispatch()
  const anchorRef = useRef(null)
  const rafRef = useRef(null)

  const handleCellMouseDown = useCallback((dayName, wi, ti, weekMonday, time, e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    const dayGridEl = e.currentTarget.parentElement
    const anchor = {
      active: true,
      dayName,
      startWeekIndex: wi,
      endWeekIndex: wi,
      startTimeIndex: ti,
      endTimeIndex: ti,
      weekMonday,
      time,
    }
    anchorRef.current = anchor
    dispatch(setDragSelection(anchor))
    dispatch(clearConfirmedSelection())

    const resolveCell = (clientX, clientY) => {
      if (!dayGridEl || !weeks.length) return anchorRef.current
      const rect = dayGridEl.getBoundingClientRect()
      const colW = rect.width / weeks.length
      const rowH = rect.height / timeSlots.length
      const endWi = Math.max(0, Math.min(weeks.length - 1, Math.floor((clientX - rect.left) / colW)))
      const endTi = Math.max(0, Math.min(timeSlots.length - 1, Math.floor((clientY - rect.top) / rowH)))
      return { ...anchorRef.current, endWeekIndex: endWi, endTimeIndex: endTi }
    }

    const onMove = (ev) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const next = resolveCell(ev.clientX, ev.clientY)
        anchorRef.current = next
        dispatch(setDragSelection(next))
      })
    }

    const onUp = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      const final = anchorRef.current
      if (final) {
        const weekSpan = Math.abs(final.endWeekIndex - final.startWeekIndex) + 1
        const timeSpan = Math.abs(final.endTimeIndex - final.startTimeIndex) + 1
        if (weekSpan > 1 || timeSpan > 1) {
          dispatch(setConfirmedSelection({ ...final, active: false }))
        } else {
          dispatch(clearConfirmedSelection())
        }
      }
      dispatch(clearDragSelection())
      anchorRef.current = null
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [dispatch, weeks, timeSlots])

  return { handleCellMouseDown }
}
