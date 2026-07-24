# API Field Reference

Complete field-level documentation for all mock API entities.

---

## DayPart

Returned by `fetchDayParts()`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier. Values: `prime_time`, `daytime`, `late_night`. Used to filter events by time range. |
| `name` | string | Yes | Display label shown in toolbar dropdown, e.g. "Prime Time (8:00-12:00 PM)". |
| `start` | string (HH:mm) | Yes | Inclusive start of visible time slots. Events with `startTime` hour ≥ this are included. |
| `end` | string (HH:mm) | Yes | Exclusive end of day part. Events with `startTime` hour < this are included. |

---

## Week

Returned by `fetchQuarterWeeks(quarter)`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `monday` | ISO date | Yes | Monday of this week column. Primary key for week identity. |
| `quarter` | string | Yes | Quarter label, e.g. `1Q27`. Format: `{1-4}Q{YY}`. |
| `month` | string | Yes | Short month name (`Jan`–`Dec`) for header month row. |
| `dates` | Record<DayName, ISO date> | Yes | Map of each day name to its calendar date in this week. Used for event column positioning. |

---

## BroadcastEvent

Returned by `fetchBroadcastEvents()`. Stored in Redux `events.present`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique event ID. Seed: `baking`, `tbd`. Bulk: `bulk_0`. User-created: `evt_{timestamp}`. |
| `title` | string | Yes | Program display name shown in event title bar. |
| `programId` | string | Yes | Lookup key for calendar color in `mockData.calendars`. |
| `dayName` | DayName | Yes | Row anchor: which day-of-week row this event appears on. |
| `startDate` | ISO date | Yes | First air date for this event (on `dayName`). Left edge of event block. |
| `endDate` | ISO date | Yes | Last air date for this event (on `dayName`). Right edge of event block. |
| `startTime` | HH:mm | Yes | Top of event block within the day row. Must align to 30-min slots. |
| `endTime` | HH:mm | Yes | Bottom of event block. Duration = endTime − startTime. |
| `color` | hex string | Yes | Title bar background tint. Sourced from `calendars[].backgroundColor`. |
| `segments` | number[] | Yes | Episode numbers, one per week column spanned. `segments[i]` maps to week `startCol + i`. |
| `warning` | boolean | No | When true, marks unresolved/TBD programming. Seed `tbd` only. |
| `inBin` | boolean | No | Soft delete. Event hidden from grid but kept in store. Set by "Move to Bin". |
| `generated` | boolean | No | True for bulk-generated events from `bulkDataGenerator`. |
| `conflictFree` | boolean | No | True when bulk generator placed event in exclusive time lane. |
| `programId` | string | Yes | Links to legend/calendar color config. |
| `formData` | object | No | Full modal form snapshot saved on commit. |
| `weekCount` | number | No | Number of weeks selected when created via cell drag. Used to pre-fill episode count. |
| `hasConflict` | boolean | No | Runtime flag set when conflict detected. Not persisted in mock store. |

### Positioning rules
- Column range: weeks where `dates[dayName]` is between `startDate` and `endDate`
- Row top: `(startTime − dayPart.start) / 30min × 22px`
- Min height: 40px when `segments.length > 0`

---

## Calendar (Program Color)

From `mockData.calendars`. Used for event colors and footer legend.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Matches `BroadcastEvent.programId` |
| `name` | string | Program display name |
| `backgroundColor` | hex | Event title bar base color |
| `borderColor` | hex | Border accent |
| `color` | hex | Text color on event |

---

## LegendItem

Returned by `fetchLegend()`. Shown in LrvFooter.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Category key: `borrow`, `return`, `new`, `special`, `tbd` |
| `label` | string | Display name in footer |
| `count` | number \| null | Hours count number. Null when not applicable. |
| `color` | hex | Chip color in footer |

---

## FormDefaults

Returned by `fetchProgramDefaults(event?)`.

| Field | Type | Description |
|-------|------|-------------|
| `programType` | string | `Series` or `Returning` |
| `programName` | string | Program title (editable, datalist-backed) |
| `season` | string | Season number |
| `episodes` | string | Episode count for segment generation |
| `telecastStart` | ISO date | Maps to event `startDate` on commit |
| `telecastEnd` | ISO date | Maps to event `endDate` on commit |
| `startTime` | HH:mm | Maps to event `startTime` |
| `duration` | string | Minutes: `30`, `60`, `90`, `120`. Used to compute `endTime`. |
| `exhibitionsAllowed` | number | Max exhibitions allowed |
| `exhibitionsUsed` | number | Currently used exhibitions |
| `flags` | object | `doNotAir`, `doNotPublish`, `runOrderConfirmed`, `publishCustomerSeason` |
| `titleType` | string | `working` or `confirmed` |
| `workingTitle` | string | Free-text working title |
| `lpStart` / `lpEnd` | ISO date | License period dates |
| `primaryNetwork` | string | Primary broadcast network |
| `authorizedNetworks` | string | Secondary authorized network |
| `deliveryDate` | ISO date | Content delivery date |
| `deliveryNotConfirmed` | boolean | Delivery date TBD flag |
| `notes` | string | Free-text production notes |
| `tagType` | string | `episode` or `series` tagging mode |
| `tagEpisode` | string | Episode number for tagging |

---

## AirDateRow

Returned by `fetchAirDates()`. Shown in modal Miscellaneous tab.

| Field | Type | Description |
|-------|------|-------------|
| `episode` | number | Episode number |
| `date` | string | Short date display, e.g. `2/23` |
| `time` | HH:mm | Scheduled air time |
| `network` | string | Network name |
| `totalAirings` | number | Total scheduled airings for episode |

---

## BrowserSession

Stored in `localStorage` key `lrv_browser_sessions`. Managed by `useSessionPresence`.

| Field | Type | Description |
|-------|------|-------------|
| `tabId` | string | Unique per browser tab (`sessionStorage` persisted) |
| `userId` | string | Assigned user pool ID: `cn`, `lh`, `ak`, `mj`, `rs` |
| `initials` | string | 2-letter avatar display |
| `name` | string | Full display name |
| `color` | hex | Avatar background color |
| `lastSeen` | number | Epoch ms of last heartbeat. TTL = 12 seconds. |
| `startedAt` | number | Epoch ms when tab first registered |

---

## GridCard (Landing)

Returned by `fetchGridCards()`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `lrv` or `24hr` |
| `title` | string | Card title |
| `lastEdited` | string | Last edit time display |
| `collaborators` | string[] | User IDs with avatars |
| `extraCount` | number | Additional collaborator count |
| `enabled` | boolean | Whether card is clickable. `24hr` is false. |

---

## DataStats

Returned by `fetchDataStats()`.

| Field | Type | Description |
|-------|------|-------------|
| `totalEvents` | number | All events in memory store |
| `bulkEvents` | number | Generated bulk count |
| `seedEvents` | number | Hand-authored seed count |
| `bulkEnabled` | boolean | Whether bulk generator is active |

---

## Redux State Fields

### events slice
| Field | Description |
|-------|-------------|
| `present` | Current event array |
| `past` | Undo stack (array of previous arrays) |
| `future` | Redo stack |
| `loading` | True while `fetchBroadcastEvents` in flight |

### ui slice
| Field | Description |
|-------|-------------|
| `selectedDayPart` | Active day part filter ID |
| `loadedQuarters` | Quarters loaded into grid, e.g. `['1Q27','2Q27']` |
| `selectedMonday` | Highlighted week monday in header |
| `selectedQuarter` | Highlighted quarter in header |
| `dragSelection` | Active pointer drag `{ dayName, startWeekIndex, endWeekIndex, startTimeIndex, endTimeIndex }` |
| `confirmedSelection` | Completed multi-cell selection awaiting Create Event |
| `zoom` | Grid zoom level 0.75–1.75 |
| `quarterLoading` | True while loading next quarter |
| `loadingLabel` | e.g. `Loading 1Q28 (2028)…` |
| `tooltipEnabled` | Tooltip toggle state |
| `selectedEvent` | Event shown in tooltip |
| `tooltipPosition` | `{ x, y }` cursor coords for tooltip |
| `contextMenu` | `{ event, position }` for right-click menu |
| `clipboard` | Copied event (no id) |
| `modalOpen` | Create/edit modal visibility |
| `editingEvent` | Event being edited (null for create) |
| `createDefaults` | Pre-fill values from cell selection |
