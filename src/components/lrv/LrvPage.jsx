import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDayParts, fetchLegend } from '../../api/mockApi'
import { useSessionPresence } from '../../hooks/useSessionPresence'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCanRedo,
  selectCanUndo,
  selectVisibleEvents,
  setEventsLoading,
  undo,
  redo,
} from '../../store/slices/eventsSlice'
import {
  selectAppLoading,
  selectCurrentDayPart,
  selectDayParts,
  selectLegendItems,
  setAppData,
} from '../../store/slices/appSlice'
import {
  clearContextMenu,
  clearSelectedEvent,
  closeModal,
  openCreateModal,
  openEditModal,
  selectUi,
  setClipboard,
  setContextMenu,
  setQuarterLoading,
  setSelectedDayPart,
  setSelectedEvent,
  toggleFooter,
  toggleTooltip,
} from '../../store/slices/uiSlice'
import {
  commitEvent,
  deleteEventById,
  loadEventsForQuarters,
  moveEventToBin,
  pasteEvent,
  updateEvent,
} from '../../store/thunks/eventThunks'
import LrvHeader from './LrvHeader'
import LrvToolbar from './LrvToolbar'
import BroadcastCalendar from './BroadcastCalendar'
import LrvFooter from './LrvFooter'
import EventCreateModal from './EventCreateModal'
import EventTooltip from './EventTooltip'
import ContextMenu from './ContextMenu'

export default function LrvPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const ui = useAppSelector(selectUi)
  const dayParts = useAppSelector(selectDayParts)
  const legendItems = useAppSelector(selectLegendItems)
  const appLoading = useAppSelector(selectAppLoading)
  const currentDayPart = useAppSelector(selectCurrentDayPart)
  const events = useAppSelector(selectVisibleEvents)
  const canUndo = useAppSelector(selectCanUndo)
  const canRedo = useAppSelector(selectCanRedo)
  const { currentUser, activeUsers, activeSessionCount } = useSessionPresence()

  useEffect(() => {
    Promise.all([fetchDayParts(), fetchLegend()]).then(([parts, legend]) => {
      dispatch(setAppData({ dayParts: parts, legendItems: legend }))
    })
  }, [dispatch])

  useEffect(() => {
    if (!appLoading) {
      const run = async () => {
        dispatch(setEventsLoading(true))
        await dispatch(loadEventsForQuarters(ui.selectedDayPart, ui.loadedQuarters))
        dispatch(setEventsLoading(false))
        dispatch(setQuarterLoading({ loading: false, label: null }))
      }
      run()
    }
  }, [ui.selectedDayPart, ui.loadedQuarters, appLoading, dispatch])

  const handleEventSelect = useCallback((event, position) => {
    dispatch(setSelectedEvent({ event, position }))
  }, [dispatch])

  const handleEventContextMenu = useCallback((event, position) => {
    dispatch(setContextMenu({ event, position }))
    dispatch(setSelectedEvent({ event, position }))
  }, [dispatch])

  const handleEventUpdate = useCallback((updated) => {
    dispatch(updateEvent(updated, 'move'))
    dispatch(setSelectedEvent({ event: updated }))
  }, [dispatch])

  const handleEventDoubleClick = useCallback((event) => {
    dispatch(openEditModal(event))
  }, [dispatch])

  const handleCreateEvent = useCallback((defaults) => {
    dispatch(openCreateModal(defaults))
  }, [dispatch])

  const handleOpenCreateModal = useCallback(() => {
    dispatch(openCreateModal({
      dayName: 'Monday',
      startDate: '2027-01-19',
      endDate: '2027-01-19',
      startTime: '09:00',
      endTime: '10:00',
    }))
  }, [dispatch])

  const handleModalCommit = useCallback(async (event) => {
    const isNew = !events.find((e) => e.id === event.id)
    await dispatch(commitEvent(event, isNew))
    dispatch(closeModal())
  }, [dispatch, events])

  const handleContextAction = useCallback((action) => {
    const target = ui.contextMenu?.event
    if (!target) return

    if (action === 'copy') {
      dispatch(setClipboard({ ...target, id: undefined }))
    } else if (action === 'paste') {
      dispatch(pasteEvent(ui.clipboard, target))
    } else if (action === 'add') {
      dispatch(openCreateModal({
        dayName: target.dayName,
        startDate: target.startDate,
        endDate: target.endDate,
        startTime: target.startTime,
        endTime: target.endTime,
      }))
    } else if (action === 'bin') {
      dispatch(moveEventToBin(target.id))
    } else if (action === 'delete') {
      dispatch(deleteEventById(target.id))
      dispatch(clearSelectedEvent())
    }
    dispatch(clearContextMenu())
  }, [dispatch, ui.clipboard, ui.contextMenu])

  if (appLoading || !currentDayPart) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" role="status" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <LrvHeader />

      <LrvToolbar
        dayParts={dayParts}
        selectedDayPart={ui.selectedDayPart}
        onDayPartChange={(id) => dispatch(setSelectedDayPart(id))}
        tooltipEnabled={ui.tooltipEnabled}
        onTooltipToggle={() => dispatch(toggleTooltip())}
        onNavigateHome={() => navigate('/')}
        onUndo={() => dispatch(undo())}
        onRedo={() => dispatch(redo())}
        canUndo={canUndo}
        canRedo={canRedo}
        onCreateEvent={handleOpenCreateModal}
        activeUsers={activeUsers}
        currentUserId={currentUser.id}
        sessionCount={activeSessionCount}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <BroadcastCalendar
          events={events}
          dayPart={currentDayPart}
          onEventSelect={handleEventSelect}
          onEventUpdate={handleEventUpdate}
          onEventDoubleClick={handleEventDoubleClick}
          onEventContextMenu={handleEventContextMenu}
          onCreateEvent={handleCreateEvent}
          activeUsers={activeUsers}
          currentUser={currentUser}
        />

        {ui.tooltipEnabled && (
          <EventTooltip
            event={ui.selectedEvent}
            position={ui.tooltipPosition}
            onClose={() => dispatch(clearSelectedEvent())}
          />
        )}

        {ui.contextMenu && (
          <ContextMenu
            position={ui.contextMenu.position}
            onAction={handleContextAction}
            onClose={() => dispatch(clearContextMenu())}
          />
        )}
      </div>

      <LrvFooter
        legendItems={legendItems}
        expanded={ui.footerExpanded}
        onToggle={() => dispatch(toggleFooter())}
      />

      <EventCreateModal
        open={ui.modalOpen}
        event={ui.editingEvent ?? ui.createDefaults}
        onClose={() => dispatch(closeModal())}
        onCommit={handleModalCommit}
      />
    </div>
  )
}
