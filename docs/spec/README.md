# LRV Broadcast Calendar — Specification

Prototype broadcast scheduling grid for Food Network blueprint tooling.

## Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, Vite, Tailwind CSS v4 |
| Routing | React Router |
| State | React hooks + local undo/redo history |
| Data | Mock APIs (in-memory + localStorage sessions) |

## Routes

| Path | Screen |
|------|--------|
| `/` | Landing — LRV card (enabled), 24hr Grid (disabled) |
| `/lrv` | Broadcast calendar (LRV Grid) |

## Implemented Features (v0.1)

### Layout
- Two-row header: branding/export top bar + toolbar controls
- Scroll-synced quarter / month / week timeline header
- Mon–Sun day rows with 30-minute time slots
- Hours Count footer legend

### Calendar Grid
- Horizontal scroll with lazy quarter loading (2027 → 2028 → …)
- Zoom controls (+/−) 75%–175% with live percentage label
- Event blocks: title row + per-week episode cells
- Conflict overlay: pink/blue hatch, dashed red border, episode numbers
- Cell drag-selection (horizontal + vertical) → Create Event bar

### Events
- Create / edit modal (Program + Miscellaneous tabs)
- Custom program name (text + datalist)
- Drag-move, resize width (weeks), resize height (time)
- Right-click menu: Copy, Paste, Add to Grid, Move to Bin, Delete
- Tooltip at click position (toggleable)

### Collaboration
- Browser session tracking via `localStorage` heartbeat
- Active session count in toolbar
- Per-tab user avatar assignment
- Peer cell highlights for other browser sessions

### History
- Undo / redo with disabled state when stack empty
- Redux `events` slice: `present` / `past` / `future` stacks

### State Management
- Redux Toolkit store (`src/store/`)
- `eventsSlice` — events + undo/redo
- `uiSlice` — selection, modal, zoom, quarters
- `appSlice` — dayParts, legend
- Thunks for async event CRUD

### Data
- Seed events (10 programs) + bulk generator (2027–2030, conflict-free lanes)
- Bulk uses exclusive 30-min slots; skips seed-occupied lanes
- API returns only events overlapping loaded quarters
- Only seed TBD+Kitchen Stories pair shows conflict overlay

## Key Files

```
docs/spec/           — This specification set
src/api/             — Mock APIs + bulk data generator
src/hooks/           — useHistory, useSessionPresence, useCollaboration
src/utils/           — broadcastCalendar.js (grid math, conflicts, zoom)
src/components/lrv/  — LRV screen components
src/components/landing/ — Landing page
```

## Non-Goals (Prototype)

- Real backend / WebSocket presence
- Persistent event storage across page reloads (mock store resets on HMR in dev)
- 24hr Grid screen

## Related Specs

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Component & hook inventory
- [API.md](./API.md) — Mock API contract
- [API-FIELDS.md](./API-FIELDS.md) — Field-by-field reference for every entity
- [DATA-MODEL.md](./DATA-MODEL.md) — Event & session schemas
- [UI-BEHAVIOR.md](./UI-BEHAVIOR.md) — Interaction specification
- [REDUX.md](./REDUX.md) — Redux store usage guide

## Cursor Development

- **Agent guide**: [`AGENTS.md`](../../AGENTS.md) at project root
- **Cursor rule**: [`.cursor/rules/lrv-calendar-spec.mdc`](../../.cursor/rules/lrv-calendar-spec.mdc) (always applied)
