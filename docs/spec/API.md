# Mock API Specification

All APIs simulate network delay (50–300ms) and operate in-memory unless noted.

## Day Parts

```
GET fetchDayParts() → DayPart[]
```

```ts
interface DayPart {
  id: string          // 'prime_time' | 'daytime' | 'late_night'
  name: string
  start: string       // 'HH:mm'
  end: string
}
```

## Calendar Weeks

```
GET fetchQuarterWeeks(quarter: string) → Week[]
```

- `quarter` format: `1Q27`, `2Q28`, etc.
- Returns Monday-anchored weeks for that calendar quarter
- Used for header + grid columns

```ts
interface Week {
  monday: string      // ISO date
  quarter: string
  month: string       // 'Jan'…'Dec'
  dates: Record<DayName, string>
}
```

## Broadcast Events

```
GET fetchBroadcastEvents(dayPartId, quarters[]) → BroadcastEvent[]
```

**Filtering (memory optimization):**
1. Event `startTime` hour must fall within day-part range
2. Event date range must overlap any loaded quarter range

```
POST saveBroadcastEvent(event, action?) → BroadcastEvent
DELETE deleteBroadcastEvent(eventId) → boolean
```

```ts
interface BroadcastEvent {
  id: string
  title: string
  programId: string
  dayName: DayName
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  color: string
  segments: number[]
  warning?: boolean
  inBin?: boolean
  generated?: boolean
}
```

## Bulk Data

```
Internal: generateBulkBroadcastEvents(count = 400)
GET fetchDataStats() → { totalEvents, bulkEvents, seedEvents, bulkEnabled }
```

- Bulk events generated once and cached
- Span all 7 days, multiple time slots, 1–4 week spans
- Merged with 6 seed events in `eventsStore`

## Event Form

```
GET fetchProgramDefaults(event?) → FormDefaults
GET fetchProgramNames() → string[]
GET fetchNetworks() → string[]
GET fetchAirDates() → AirDateRow[]
GET fetchFormOptions() → { durations, startTimes }
```

## Session Presence (Browser)

Not a fetch — uses `localStorage` key `lrv_browser_sessions`:

```ts
interface BrowserSession {
  tabId: string       // sessionStorage per tab
  userId: string
  initials: string
  name: string
  color: string
  lastSeen: number    // epoch ms
  startedAt: number
}
```

- Heartbeat: every 3s
- TTL: 12s without heartbeat → session pruned
- `storage` event syncs across tabs
- Active session count = length of pruned session list

## Landing

```
GET fetchGridCards() → GridCard[]
GET fetchQuickLinks() → QuickLink[]
GET fetchUser() → { name, greeting, initials }
GET fetchLegend() → LegendItem[]
```
