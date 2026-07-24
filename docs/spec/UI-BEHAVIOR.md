# UI Behavior Specification

## Undo / Redo

| State | Undo button | Redo button |
|-------|-------------|-------------|
| No history | Disabled (35% opacity) | Disabled |
| After change | Enabled | Disabled |
| After undo | Enabled | Enabled |
| After new change post-undo | Enabled | Disabled (future cleared) |

Triggers history: event move/resize, create, delete, paste, move-to-bin.

## Zoom (+/−)

- Location: bottom-right corner of calendar
- Range: 75% – 175% in 25% steps
- Shows current percentage below buttons
- `+` disabled at 175%; `−` disabled at 75%
- Scales entire grid via CSS transform; scroll area adjusts width

## Session Presence

- Open multiple browser tabs to `/lrv` → session count increases
- Close tab → session removed after TTL (12s)
- Toolbar shows: `N sessions active` + avatar per session
- Current tab user has purple ring on avatar
- Other sessions show cell selection rings on grid

## Cell Selection → Create Event

1. Mousedown on empty cell
2. Drag horizontally (weeks) and/or vertically (time slots)
3. Release → purple dashed selection + action bar
4. Action bar shows: `N weeks × M min (dates)` + **Create Event**
5. Opens modal with pre-filled dates, times, episode count

Single click without drag: no action bar.

## Event Block Layout (30-min responsive)

```
┌─────────────────────────────────┐
│         Program Title           │  ← colored title bar
├──────┬──────┬──────┬──────┬─────┤
│ 101  │ 102  │ 103  │ 104  │ 105 │  ← white episode cells
└──────┴──────┴──────┴──────┴─────┘
```

- Minimum height 40px when episodes shown
- Adapts to 1-week (compact) or multi-week spans

## Conflict Overlay

When two programs overlap in time + date on same day:

- Dashed red border
- Pink/blue diagonal hatch (program colors)
- Both episode numbers visible in overlap cells

## Tooltip

- Toggle via toolbar switch
- Appears at cursor on event click
- Dismiss via × button

## Right-Click Menu

| Action | Behavior |
|--------|----------|
| Copy | Stores event in clipboard |
| Paste | Creates copy at target dates |
| Add to Grid | Opens create modal |
| Move to Bin | Hides event (soft delete) |
| Delete | Removes event (red text) |

## Horizontal Scroll Loading

- Initial quarters: `1Q27`, `2Q27`
- Near right edge → load next quarter automatically
- Continues across years (`4Q27` → `1Q28`)
- Loading indicator: bottom-right "Loading next period…"

## Performance / Memory

- Bulk store: 400 generated events (all days, multiple slots)
- API returns only events overlapping loaded quarters
- Bulk cache: single generation, reused
- Target: no UI hang on initial load with 2 quarters loaded

## Footer

- Hours Count legend with color chips
- Expand/collapse toggle
