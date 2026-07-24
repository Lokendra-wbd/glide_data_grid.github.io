import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedDayPart: 'prime_time',
  loadedQuarters: ['1Q27', '2Q27', '3Q27'],
  selectedMonday: '2027-01-19',
  selectedQuarter: '1Q27',
  tooltipEnabled: true,
  footerExpanded: true,
  selectedEvent: null,
  tooltipPosition: null,
  contextMenu: null,
  clipboard: null,
  modalOpen: false,
  editingEvent: null,
  createDefaults: null,
  dragSelection: null,
  confirmedSelection: null,
  zoom: 1,
  quarterLoading: false,
  loadingLabel: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedDayPart(state, action) {
      state.selectedDayPart = action.payload
    },
    addLoadedQuarter(state, action) {
      if (!state.loadedQuarters.includes(action.payload)) {
        state.loadedQuarters.push(action.payload)
      }
    },
    setSelectedMonday(state, action) {
      state.selectedMonday = action.payload
    },
    setSelectedQuarter(state, action) {
      state.selectedQuarter = action.payload
    },
    setTooltipEnabled(state, action) {
      state.tooltipEnabled = action.payload
    },
    toggleTooltip(state) {
      state.tooltipEnabled = !state.tooltipEnabled
    },
    setFooterExpanded(state, action) {
      state.footerExpanded = action.payload
    },
    toggleFooter(state) {
      state.footerExpanded = !state.footerExpanded
    },
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload.event
      state.tooltipPosition = action.payload.position ?? state.tooltipPosition
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null
      state.tooltipPosition = null
    },
    setContextMenu(state, action) {
      state.contextMenu = action.payload
    },
    clearContextMenu(state) {
      state.contextMenu = null
    },
    setClipboard(state, action) {
      state.clipboard = action.payload
    },
    openCreateModal(state, action) {
      state.modalOpen = true
      state.editingEvent = null
      state.createDefaults = action.payload ?? null
    },
    openEditModal(state, action) {
      state.modalOpen = true
      state.editingEvent = action.payload
      state.createDefaults = null
    },
    closeModal(state) {
      state.modalOpen = false
      state.editingEvent = null
      state.createDefaults = null
    },
    setDragSelection(state, action) {
      state.dragSelection = action.payload
    },
    clearDragSelection(state) {
      state.dragSelection = null
    },
    setConfirmedSelection(state, action) {
      state.confirmedSelection = action.payload
    },
    clearConfirmedSelection(state) {
      state.confirmedSelection = null
    },
    setZoom(state, action) {
      state.zoom = action.payload
    },
    setQuarterLoading(state, action) {
      state.quarterLoading = action.payload.loading
      state.loadingLabel = action.payload.label ?? null
    },
  },
})

export const {
  setSelectedDayPart,
  addLoadedQuarter,
  setSelectedMonday,
  setSelectedQuarter,
  setTooltipEnabled,
  toggleTooltip,
  setFooterExpanded,
  toggleFooter,
  setSelectedEvent,
  clearSelectedEvent,
  setContextMenu,
  clearContextMenu,
  setClipboard,
  openCreateModal,
  openEditModal,
  closeModal,
  setDragSelection,
  clearDragSelection,
  setConfirmedSelection,
  clearConfirmedSelection,
  setZoom,
  setQuarterLoading,
} = uiSlice.actions

export const selectUi = (state) => state.ui
export const selectDragSelection = (state) => state.ui.dragSelection
export const selectConfirmedSelection = (state) => state.ui.confirmedSelection
export const selectQuarterLoading = (state) => state.ui.quarterLoading
export const selectLoadingLabel = (state) => state.ui.loadingLabel

export default uiSlice.reducer
