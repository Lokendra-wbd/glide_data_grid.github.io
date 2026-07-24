# Redux Store Guide

## Overview

All LRV screen state is centralized in Redux Toolkit store at `src/store/`.

```js
import { Provider } from 'react-redux'
import { store } from './store'
// main.jsx wraps <App /> with <Provider store={store}>
```

## Slices

### `events` — Event data + undo/redo

```js
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectVisibleEvents, selectCanUndo, undo, redo } from '../store/slices/eventsSlice'

const events = useAppSelector(selectVisibleEvents)  // filters inBin
const canUndo = useAppSelector(selectCanUndo)
dispatch(undo())
```

| Action | Effect |
|--------|--------|
| `setEvents(arr)` | Replace events, clear undo stacks (used on quarter reload) |
| `applyChange(arr)` | Push to past, set present, clear future |
| `undo()` | Pop past → present, push present → future |
| `redo()` | Pop future → present, push present → past |

### `ui` — Interface state

```js
import { selectUi, setDragSelection, openCreateModal } from '../store/slices/uiSlice'

const ui = useAppSelector(selectUi)
dispatch(setDragSelection({ dayName: 'Monday', startWeekIndex: 0, ... }))
```

Key state: selection, modal, zoom, loaded quarters, tooltip, context menu, clipboard.

### `app` — Bootstrap config

```js
import { selectDayParts, selectCurrentDayPart } from '../store/slices/appSlice'
```

Loaded once on mount via `fetchDayParts()` + `fetchLegend()`.

## Thunks

Always use thunks for event mutations that should be undoable:

```js
import { updateEvent, createEvent, commitEvent, loadEventsForQuarters } from '../store/thunks/eventThunks'

// Move event (undoable)
dispatch(updateEvent(updatedEvent, 'move'))

// Create from modal (undoable)
dispatch(commitEvent(newEvent, true))

// Reload when quarters change
dispatch(loadEventsForQuarters('prime_time', ['1Q27', '2Q27', '3Q27']))
```

## Selection Flow

```
pointerdown on cell
  → setDragSelection (immediate, Redux)
pointermove (rAF throttled)
  → setDragSelection (updated end indices)
pointerup
  → setConfirmedSelection (if multi-cell) OR clear
  → clearDragSelection
```

Selection state lives in `ui.dragSelection` and `ui.confirmedSelection`.
Read via `useAppSelector(selectDragSelection)`.

## Quarter Loading Flow

```
scroll near right edge
  → setQuarterLoading({ loading: true, label: 'Loading 1Q28 (2028)…' })
  → addLoadedQuarter('1Q28')
  → loadEventsForQuarters(dayPart, updatedQuarters)
  → setQuarterLoading({ loading: false })
```

## Migration Notes

Removed from LrvPage:
- `useState` for events, selection, modal, quarters
- `useHistory` hook (replaced by events slice past/future)

Kept as hooks (not Redux):
- `useSessionPresence` — localStorage side effect
- `useCollaboration` — derived peer selections
- `useGridSelection` — pointer event listeners (dispatches to Redux)

## Adding New State

1. UI-only → `uiSlice`
2. Event data → `eventsSlice` + thunk with `applyChange`
3. Server config → `appSlice`
4. Document in `API-FIELDS.md` Redux section
