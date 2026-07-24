export const WEEK_COL_WIDTH = 72
export const SLOT_HEIGHT = 40
export const TIME_SLOT_MINUTES = 30
export const DAY_LABEL_WIDTH = 88
export const TIME_LABEL_WIDTH = 44
export const EVENT_TITLE_HEIGHT = 18
export const EVENT_EPISODE_HEIGHT = 22
export const EVENT_MIN_DISPLAY_HEIGHT = EVENT_TITLE_HEIGHT + EVENT_EPISODE_HEIGHT

export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const DAY_TO_JS = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 }

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatShortDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function addDays(iso, days) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function getMonday(iso) {
  const d = new Date(iso + 'T12:00:00')
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export function getDateForDay(weekMonday, dayName) {
  const offsets = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 }
  return addDays(weekMonday, offsets[dayName])
}

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Display label like "8:00" (no leading zero on hour) */
export function formatTimeLabel(time) {
  const [h, m] = time.split(':').map(Number)
  return `${h}:${String(m).padStart(2, '0')}`
}

export function getEventSlotCount(event) {
  return Math.max(1, (timeToMinutes(event.endTime) - timeToMinutes(event.startTime)) / TIME_SLOT_MINUTES)
}

export function snapToSlot(mins) {
  return Math.round(mins / TIME_SLOT_MINUTES) * TIME_SLOT_MINUTES
}

export function generateTimeSlots(start, end) {
  const slots = []
  let mins = timeToMinutes(start)
  const endMins = timeToMinutes(end)
  while (mins < endMins) {
    slots.push({
      start: minutesToTime(mins),
      end: minutesToTime(mins + TIME_SLOT_MINUTES),
    })
    mins += TIME_SLOT_MINUTES
  }
  return slots
}

/** @param {{ start: string, end: string } | string} slot */
export function slotStart(slot) {
  return typeof slot === 'string' ? slot : slot.start
}

/** @param {{ start: string, end: string } | string} slot */
export function slotEnd(slot) {
  if (typeof slot === 'string') {
    return minutesToTime(timeToMinutes(slot) + TIME_SLOT_MINUTES)
  }
  return slot.end
}

export function findSlotIndex(slots, startTime) {
  return slots.findIndex((s) => slotStart(s) === startTime)
}

export function getQuarterForDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  const q = Math.floor(d.getMonth() / 3) + 1
  const y = String(d.getFullYear()).slice(2)
  return `${q}Q${y}`
}

export function generateWeeksForQuarter(quarter) {
  const [qStr, yStr] = quarter.split('Q')
  const q = Number(qStr)
  const year = 2000 + Number(yStr)
  const startMonth = (q - 1) * 3

  const quarterStart =
    q === 1
      ? getMonday(`${year - 1}-12-29`)
      : getMonday(new Date(year, startMonth, 1).toISOString().slice(0, 10))

  const quarterEnd = new Date(year, startMonth + 3, 0).toISOString().slice(0, 10)

  const weeks = []
  let monday = quarterStart
  while (monday <= quarterEnd) {
    const d = new Date(monday + 'T12:00:00')
    weeks.push({
      monday,
      quarter,
      month: MONTHS_SHORT[d.getMonth()],
      dates: Object.fromEntries(DAY_NAMES.map((day) => [day, getDateForDay(monday, day)])),
    })
    monday = addDays(monday, 7)
  }
  return weeks
}

export function estimateWeekCountForQuarters(quarters) {
  return quarters.reduce((sum, q) => sum + generateWeeksForQuarter(q).length, 0)
}

export function estimateGridWidth(quarters, zoom = ZOOM_DEFAULT) {
  const weekCount = estimateWeekCountForQuarters(quarters)
  const metrics = getZoomMetrics(zoom)
  return (DAY_LABEL_WIDTH + TIME_LABEL_WIDTH + weekCount * WEEK_COL_WIDTH) * metrics.zoom
}

export function getWeekColRange(weeks, startDate, endDate, dayName) {
  let startCol = -1
  let endCol = -1
  weeks.forEach((w, i) => {
    const d = w.dates[dayName]
    if (d >= startDate && d <= endDate) {
      if (startCol === -1) startCol = i
      endCol = i
    }
  })
  return { startCol, endCol }
}

export function getEventStyle(event, weeks, dayPart, dayName) {
  const { startCol, endCol } = getWeekColRange(weeks, event.startDate, event.endDate, dayName)
  if (startCol === -1) return null

  const slotStart = timeToMinutes(dayPart.start)
  const top = ((timeToMinutes(event.startTime) - slotStart) / TIME_SLOT_MINUTES) * SLOT_HEIGHT
  const hasEpisodes = event.segments?.length > 0
  const rawHeight = ((timeToMinutes(event.endTime) - timeToMinutes(event.startTime)) / TIME_SLOT_MINUTES) * SLOT_HEIGHT
  const height = Math.max(rawHeight, hasEpisodes ? EVENT_MIN_DISPLAY_HEIGHT : SLOT_HEIGHT)

  return {
    left: startCol * WEEK_COL_WIDTH,
    width: (endCol - startCol + 1) * WEEK_COL_WIDTH,
    top,
    height,
  }
}

export function shiftDateByWeeks(iso, weeks) {
  return addDays(iso, weeks * 7)
}

export function mergeWeeks(quarterWeeksArrays) {
  const seen = new Map()
  quarterWeeksArrays.flat().forEach((w) => {
    if (!seen.has(w.monday)) seen.set(w.monday, w)
  })
  return Array.from(seen.values()).sort((a, b) => a.monday.localeCompare(b.monday))
}

export function buildQuarterSpans(weeks) {
  const spans = []
  let current = null
  weeks.forEach((w, i) => {
    if (!current || current.quarter !== w.quarter) {
      current = { quarter: w.quarter, start: i, count: 1 }
      spans.push(current)
    } else {
      current.count += 1
    }
  })
  return spans
}

export function buildMonthSpans(weeks) {
  const spans = []
  let current = null
  weeks.forEach((w, i) => {
    const key = `${w.quarter}-${w.month}`
    if (!current || current.key !== key) {
      current = { month: w.month, key, start: i, count: 1 }
      spans.push(current)
    } else {
      current.count += 1
    }
  })
  return spans
}

export function timesOverlap(a, b) {
  return timeToMinutes(a.startTime) < timeToMinutes(b.endTime)
    && timeToMinutes(b.startTime) < timeToMinutes(a.endTime)
}

export function datesOverlap(a, b) {
  return a.startDate <= b.endDate && b.startDate <= a.endDate
}

export function detectConflicts(events) {
  const conflictIds = new Set()
  const overlapCols = new Map()

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i]
      const b = events[j]
      if (a.dayName !== b.dayName) continue
      if (!timesOverlap(a, b) || !datesOverlap(a, b)) continue

      conflictIds.add(a.id)
      conflictIds.add(b.id)

      const overlapStart = a.startDate > b.startDate ? a.startDate : b.startDate
      const overlapEnd = a.endDate < b.endDate ? a.endDate : b.endDate

      const addCols = (eventId) => {
        if (!overlapCols.has(eventId)) overlapCols.set(eventId, new Set())
        return overlapCols.get(eventId)
      }

      ;[a, b].forEach((evt) => {
        const cols = addCols(evt.id)
        // cols stored as week mondays later when weeks available
        cols.add(`${overlapStart}_${overlapEnd}`)
      })
    }
  }

  return { conflictIds, overlapCols }
}

export function getConflictWeekIndices(event, allEvents, weeks, dayName) {
  const indices = new Set()
  const others = allEvents.filter((e) => e.id !== event.id && e.dayName === dayName)

  others.forEach((other) => {
    if (!timesOverlap(event, other) || !datesOverlap(event, other)) return

    const overlapStart = event.startDate > other.startDate ? event.startDate : other.startDate
    const overlapEnd = event.endDate < other.endDate ? event.endDate : other.endDate

    weeks.forEach((w, i) => {
      const d = w.dates[dayName]
      if (d >= overlapStart && d <= overlapEnd) indices.add(i)
    })
  })

  return indices
}

export function getSegmentsByWeek(event, weeks, dayName) {
  const { startCol, endCol } = getWeekColRange(weeks, event.startDate, event.endDate, dayName)
  if (startCol === -1) return []

  const items = []
  for (let i = startCol; i <= endCol; i++) {
    const segIndex = i - startCol
    items.push({
      weekIndex: i,
      segment: event.segments?.[segIndex] ?? event.segments?.[event.segments.length - 1],
      date: weeks[i].dates[dayName],
    })
  }
  return items
}

export function getNextQuarter(quarter) {
  const [qStr, yStr] = quarter.split('Q')
  let q = Number(qStr)
  let year = Number(yStr)
  q += 1
  if (q > 4) {
    q = 1
    year += 1
  }
  return `${q}Q${String(year).padStart(2, '0')}`
}

export function getConflictRegions(events, weeks, dayName, dayPart) {
  const regions = []
  const dayEvents = events.filter((e) => e.dayName === dayName)

  for (let i = 0; i < dayEvents.length; i++) {
    for (let j = i + 1; j < dayEvents.length; j++) {
      const a = dayEvents[i]
      const b = dayEvents[j]
      if (!timesOverlap(a, b) || !datesOverlap(a, b)) continue

      const overlapStart = a.startDate > b.startDate ? a.startDate : b.startDate
      const overlapEnd = a.endDate < b.endDate ? a.endDate : b.endDate
      const { startCol, endCol } = getWeekColRange(weeks, overlapStart, overlapEnd, dayName)
      if (startCol === -1) continue

      const styleA = getEventStyle(a, weeks, dayPart, dayName)
      const styleB = getEventStyle(b, weeks, dayPart, dayName)
      if (!styleA || !styleB) continue

      const top = Math.min(styleA.top, styleB.top)
      const bottom = Math.max(styleA.top + styleA.height, styleB.top + styleB.height)
      const aStartCol = getWeekColRange(weeks, a.startDate, a.endDate, dayName).startCol
      const bStartCol = getWeekColRange(weeks, b.startDate, b.endDate, dayName).startCol

      const overlapCells = []
      for (let col = startCol; col <= endCol; col++) {
        overlapCells.push({
          weekIndex: col,
          segmentA: a.segments?.[col - aStartCol],
          segmentB: b.segments?.[col - bStartCol],
        })
      }

      regions.push({
        id: `conflict-${a.id}-${b.id}`,
        left: startCol * WEEK_COL_WIDTH,
        width: (endCol - startCol + 1) * WEEK_COL_WIDTH,
        top,
        height: bottom - top,
        eventA: a,
        eventB: b,
        overlapCells,
      })
    }
  }
  return regions
}

export const ZOOM_MIN = 0.75
export const ZOOM_MAX = 1.75
export const ZOOM_STEP = 0.25
export const ZOOM_DEFAULT = 1

export function clampZoom(zoom) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom / ZOOM_STEP) * ZOOM_STEP))
}

export function getZoomMetrics(zoom = ZOOM_DEFAULT) {
  const z = clampZoom(zoom)
  return {
    zoom: z,
    weekColWidth: WEEK_COL_WIDTH * z,
    slotHeight: SLOT_HEIGHT * z,
    dayLabelWidth: DAY_LABEL_WIDTH * z,
    timeLabelWidth: TIME_LABEL_WIDTH * z,
    titleHeight: EVENT_TITLE_HEIGHT * z,
    episodeHeight: EVENT_EPISODE_HEIGHT * z,
  }
}

export function buildHeaderRows(weeks, selectedMonday) {
  return weeks.map((w) => ({
    quarter: w.quarter,
    month: w.month,
    date: formatShortDate(w.monday),
    monday: w.monday,
    selected: w.monday === selectedMonday,
    highlighted: ['1/19', '4/20', '6/14', '8/16'].includes(formatShortDate(w.monday)),
  }))
}
