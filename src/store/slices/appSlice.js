import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dayParts: [],
  legendItems: [],
  loading: true,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppData(state, action) {
      state.dayParts = action.payload.dayParts
      state.legendItems = action.payload.legendItems
      state.loading = false
    },
    setAppLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setAppData, setAppLoading } = appSlice.actions
export const selectDayParts = (state) => state.app.dayParts
export const selectLegendItems = (state) => state.app.legendItems
export const selectAppLoading = (state) => state.app.loading
export const selectCurrentDayPart = (state) =>
  state.app.dayParts.find((d) => d.id === state.ui.selectedDayPart)

export default appSlice.reducer
