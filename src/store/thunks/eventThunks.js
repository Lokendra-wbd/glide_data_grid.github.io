import { fetchBroadcastEvents, saveBroadcastEvent } from '../../api/mockApi'
import { applyChange, setEvents, setEventsLoading } from '../slices/eventsSlice'

export function loadEventsForQuarters(dayPartId, quarters) {
  return async (dispatch) => {
    dispatch(setEventsLoading(true))
    const data = await fetchBroadcastEvents(dayPartId, quarters)
    dispatch(setEvents(data))
    dispatch(setEventsLoading(false))
  }
}

export function updateEvent(event, action = 'update') {
  return async (dispatch, getState) => {
    const prev = getState().events.present
    const next = prev.map((e) => (e.id === event.id ? event : e))
    dispatch(applyChange(next))
    await saveBroadcastEvent(event, action)
  }
}

export function createEvent(event) {
  return async (dispatch, getState) => {
    const prev = getState().events.present
    dispatch(applyChange([...prev, event]))
    await saveBroadcastEvent(event, 'create')
  }
}

export function commitEvent(event, isNew) {
  return async (dispatch, getState) => {
    const prev = getState().events.present
    const next = isNew
      ? [...prev, event]
      : prev.map((e) => (e.id === event.id ? { ...e, ...event } : e))
    dispatch(applyChange(next))
    await saveBroadcastEvent(event, isNew ? 'create' : 'update')
  }
}

export function patchEvents(updater) {
  return async (dispatch, getState) => {
    const prev = getState().events.present
    const next = typeof updater === 'function' ? updater(prev) : updater
    dispatch(applyChange(next))
  }
}

export function deleteEventById(eventId) {
  return async (dispatch, getState) => {
    const prev = getState().events.present
    dispatch(applyChange(prev.filter((e) => e.id !== eventId)))
  }
}

export function moveEventToBin(eventId) {
  return async (dispatch, getState) => {
    const prev = getState().events.present
    dispatch(applyChange(prev.map((e) => (e.id === eventId ? { ...e, inBin: true } : e))))
  }
}

export function pasteEvent(clipboard, target) {
  return async (dispatch, getState) => {
    if (!clipboard) return
    const pasted = {
      ...clipboard,
      id: `evt_${Date.now()}`,
      startDate: target.startDate,
      endDate: target.endDate,
      dayName: target.dayName,
    }
    const prev = getState().events.present
    dispatch(applyChange([...prev, pasted]))
    await saveBroadcastEvent(pasted, 'create')
  }
}
