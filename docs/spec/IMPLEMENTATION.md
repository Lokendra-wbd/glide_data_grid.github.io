# Implementation Inventory

Status as of spec v0.1 — all items below are implemented in the prototype.

## Pages

| Component | Path | Status |
|-----------|------|--------|
| LandingPage | `src/components/landing/LandingPage.jsx` | Done |
| LrvPage | `src/components/lrv/LrvPage.jsx` | Done |

## LRV Chrome

| Component | Responsibility | Status |
|-----------|----------------|--------|
| LrvHeader | WB/F logos, Food dropdown, Help, Bell, Export | Done |
| LrvToolbar | LRV_Grid link, undo/redo, search, calendar, day part, tooltip toggle, sessions | Done |
| LrvFooter | Hours Count legend (expand/collapse) | Done |
| UserPresenceBar | Session count badge + collaborator avatars | Done |

## Calendar

| Component | Responsibility | Status |
|-----------|----------------|--------|
| BroadcastCalendar | Main grid, scroll, zoom, selection, quarter loading | Done |
| CalendarHeader | Quarter / month / week rows (sticky, scroll-synced) | Done |
| EventBlock | Program block with title + episode cells, DnD, resize | Done |
| ConflictOverlay | Overlap hatch between conflicting programs | Done |
| CellSelectionLayer | User + peer cell highlights | Done |
| EventTooltip | Positioned tooltip on event click | Done |
| ContextMenu | Right-click actions | Done |
| EventCreateModal | Dual-tab create/edit form | Done |

## Hooks

| Hook | Responsibility | Status |
|------|----------------|--------|
| useHistory | Undo/redo stacks, canUndo/canRedo flags | Replaced by Redux eventsSlice |
| useSessionPresence | Browser tab sessions, heartbeat, active count | Done |
| useCollaboration | Peer cell positions from other sessions | Done |
| useGridSelection | Pointer drag selection with rAF → Redux | Done |

## Utilities

| Module | Responsibility | Status |
|--------|----------------|--------|
| broadcastCalendar.js | Week gen, event positioning, conflicts, zoom metrics | Done |
| bulkDataGenerator.js | 400-event bulk seed, quarter date filtering | Done |

## API (Mock)

| Function | Status |
|----------|--------|
| fetchDayParts | Done |
| fetchLegend | Done |
| fetchQuarterWeeks | Done (any `NQYY` quarter) |
| fetchBroadcastEvents | Done (day-part + quarter filtered) |
| fetchBroadcastEvents + bulk data | Done |
| fetchDataStats | Done |
| saveBroadcastEvent | Done |
| deleteBroadcastEvent | Done |
| Session presence (localStorage) | Done |

## Pending / Future

- Real API integration (replace mock store)
- WebSocket multi-user sync (replace localStorage sessions)
- 24hr Grid screen
- Automated tests

## Documentation

| File | Purpose |
|------|---------|
| API-FIELDS.md | Every field explained |
| REDUX.md | Store usage guide |
| AGENTS.md | Cursor agent entry point |
