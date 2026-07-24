# Data Model

## Day Names

`Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday`

## Broadcast Event

Primary grid entity — spans weeks horizontally, time slots vertically.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| title | string | Display name (e.g. "Breakfast Wars") |
| programId | string | Calendar color lookup key |
| dayName | DayName | Row anchor day |
| startDate | ISO date | First air date (that dayName) |
| endDate | ISO date | Last air date (that dayName) |
| startTime | HH:mm | Slot start |
| endTime | HH:mm | Slot end |
| color | hex | Program bar color |
| segments | number[] | Episode numbers per week column |
| warning | bool | TBD / unresolved flag |
| inBin | bool | Soft-deleted from grid |
| generated | bool | From bulk generator |

### Positioning Rules

- Column = week where `week.dates[dayName]` ∈ [startDate, endDate]
- Row top = `(startTime - dayPart.start) / 30min × slotHeight`
- Row height = max(duration, 40px) when segments present

## Conflict Detection

Two events conflict when:
- Same `dayName`
- Date ranges overlap
- Time ranges overlap

Overlap region renders `ConflictOverlay` with both programs' episode numbers.

## Grid Constants

| Constant | Value | Notes |
|----------|-------|-------|
| WEEK_COL_WIDTH | 72px | Scaled by zoom |
| SLOT_HEIGHT | 22px | 30-minute slot |
| EVENT_TITLE_HEIGHT | 18px | Program name row |
| EVENT_EPISODE_HEIGHT | 22px | Episode number row |
| ZOOM range | 0.75–1.75 | Step 0.25 |

## Undo History

```
past: BroadcastEvent[][]
future: BroadcastEvent[][]
current: BroadcastEvent[]
```

- `setWithHistory` pushes current to past, clears future
- `reset` clears both stacks (used on day-part reload)

## Browser Session

Each browser tab registers one session. Multiple tabs = multiple active users in toolbar.

User assignment is deterministic from `tabId` hash into a 5-user pool (CN, LH, AK, MJ, RS).

## Quarter Identifier

Format: `{1-4}Q{YY}` — e.g. `1Q27` = Q1 2027

`getNextQuarter('4Q27')` → `1Q28`

## Seed Programs

| programId | Title | Default Color |
|-----------|-------|---------------|
| baking | Baking Champ. | #f5a623 |
| breakfast | Breakfast Wars | #7ec8e3 |
| tbd | TBD | #f4a6c1 |
| kitchen | Kitchen Stories | #7ec8e3 |
| pastry | Pastry Masters | #a8d5a2 |
| special | Chef Spotlight | #f97316 |
