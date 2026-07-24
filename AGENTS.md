# LRV Broadcast Calendar — Agent Guide

React 19 + Vite + Tailwind v4 broadcast scheduling prototype.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| Redux store | `src/store/` | Events (undo/redo), UI state, app config |
| Mock APIs | `src/api/` | In-memory data + bulk generator |
| Grid utils | `src/utils/broadcastCalendar.js` | Weeks, conflicts, zoom, positioning |
| LRV UI | `src/components/lrv/` | Calendar screen |
| Spec docs | `docs/spec/` | Full specification |

## Redux Store

```js
store.events  // { present, past, future, loading } — undo/redo via past/future stacks
store.ui      // selection, modal, zoom, quarters, tooltip, sessions UI
store.app     // dayParts, legendItems, app loading
```

**Thunks** (`src/store/thunks/eventThunks.js`): `loadEventsForQuarters`, `updateEvent`, `createEvent`, `commitEvent`, `deleteEventById`, `pasteEvent`

**Hooks**: `useAppDispatch`, `useAppSelector` from `src/store/hooks.js`

## Key Features (all implemented)

1. Two-row header (branding + toolbar)
2. Scroll-synced quarter/month/week header
3. Mon–Sun grid, 30-min slots, zoom 75–175%
4. Event blocks: title + episode cells (conflict-free bulk data)
5. Conflict overlay (seed events: TBD + Kitchen Stories on Tuesday)
6. Cell drag-selection → Create Event (pointer events + rAF)
7. Right-click menu, tooltip at cursor, undo/redo
8. Browser session presence (localStorage heartbeat)
9. Lazy quarter/year loading with scroll indicator
10. Custom program name in create modal

## Data Rules

- **Bulk events** (800): one event per (day, time-slot, week) — no conflicts
- **Seed events** (10): include intentional conflict demo
- API filters by loaded quarters to limit memory

## When Adding Features

1. Read `docs/spec/README.md` and relevant spec file
2. Put event mutations through Redux thunks (preserves undo/redo)
3. Put UI state in `uiSlice`
4. Update `docs/spec/IMPLEMENTATION.md` and `.cursor/rules/lrv-calendar-spec.mdc`
5. Document new API fields in `docs/spec/API-FIELDS.md`

## File Conventions

- Components: PascalCase `.jsx`
- Slices/thunks: camelCase `.js`
- Grid constants: `broadcastCalendar.js` only
- No direct `eventsStore` mutation outside `mockApi.js`

## Routes

- `/` — Landing (LRV enabled, 24hr Grid disabled)
- `/lrv` — Broadcast calendar
