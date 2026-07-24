import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  present: [],
  past: [],
  future: [],
  loading: false,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action) {
      state.present = action.payload
      state.past = []
      state.future = []
    },
    applyChange(state, action) {
      state.past.push(state.present)
      state.present = action.payload
      state.future = []
    },
    undo(state) {
      if (state.past.length === 0) return
      state.future.push(state.present)
      state.present = state.past.pop()
    },
    redo(state) {
      if (state.future.length === 0) return
      state.past.push(state.present)
      state.present = state.future.pop()
    },
    setEventsLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setEvents, applyChange, undo, redo, setEventsLoading } = eventsSlice.actions

export const selectVisibleEvents = createSelector(
  [(state) => state.events.present],
  (present) => present.filter((e) => !e.inBin),
)
export const selectAllEvents = createSelector(
  [(state) => state.events.present],
  (present) => present,
)
export const selectCanUndo = (state) => state.events.past.length > 0
export const selectCanRedo = (state) => state.events.future.length > 0
export const selectEventsLoading = (state) => state.events.loading

export default eventsSlice.reducer
