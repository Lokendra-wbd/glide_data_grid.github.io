import {
  addDays,
  datesOverlap,
  generateWeeksForQuarter,
  getDateForDay,
  minutesToTime,
  timeToMinutes,
  timesOverlap,
} from '../utils/broadcastCalendar'
import { calendars } from './mockData'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const calendarColors = Object.fromEntries(calendars.map((c) => [c.id, c.backgroundColor]))

const PROGRAMS = [
  { id: 'baking', title: 'Baking Champ.' },
  { id: 'breakfast', title: 'Breakfast Wars' },
  { id: 'kitchen', title: 'Kitchen Stories' },
  { id: 'pastry', title: 'Pastry Masters' },
  { id: 'special', title: 'Chef Spotlight' },
  { id: 'baking', title: 'Sweet Treats' },
  { id: 'kitchen', title: 'Farm to Table' },
  { id: 'pastry', title: 'Brunch Bites' },
  { id: 'breakfast', title: 'Morning Feast' },
  { id: 'special', title: 'Holiday Special' },
  { id: 'baking', title: 'Cupcake Wars' },
  { id: 'kitchen', title: 'Street Food Stories' },
]

const SLOTS_30MIN = []
for (let mins = 8 * 60; mins < 12 * 60; mins += 30) {
  SLOTS_30MIN.push([minutesToTime(mins), minutesToTime(mins + 30)])
}

const quarterCache = new Map()
let seedOccupied = null

function slotKey(dayName, date, startTime) {
  return `${dayName}|${date}|${startTime}`
}

function getWeeklyDatesOnDay(startDate, endDate) {
  const dates = []
  let d = startDate
  while (d <= endDate) {
    dates.push(d)
    d = addDays(d, 7)
  }
  return dates
}

function buildSeedOccupied(seedEvents) {
  if (seedOccupied) return seedOccupied
  const occupied = new Set()
  for (const event of seedEvents) {
    const startM = timeToMinutes(event.startTime)
    const endM = timeToMinutes(event.endTime)
    for (const date of getWeeklyDatesOnDay(event.startDate, event.endDate)) {
      for (let m = startM; m < endM; m += 30) {
        occupied.add(slotKey(event.dayName, date, minutesToTime(m)))
      }
    }
  }
  seedOccupied = occupied
  return occupied
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate conflict-free bulk events for a single quarter only (lazy).
 */
export async function generateBulkForQuarter(quarter, seedEvents, config) {
  const cacheKey = `${quarter}|${config.slotDensity}|${config.bulkDays?.join(',') ?? 'all'}`
  if (quarterCache.has(cacheKey)) return quarterCache.get(cacheKey)

  const occupied = buildSeedOccupied(seedEvents)
  const weeks = generateWeeksForQuarter(quarter)
  const events = []
  let id = 0
  let sinceYield = 0
  const year = getQuarterYearLabel(quarter)
  const days = config.bulkDays ?? DAY_NAMES

  for (let wi = 0; wi < weeks.length; wi++) {
    const week = weeks[wi]
    // Sparse placement — skip most weeks so blocks appear in different places
    if (wi % 2 !== 0) continue

    for (const dayName of days) {
      const date = week.dates[dayName]

      for (let slotIdx = 0; slotIdx < SLOTS_30MIN.length; slotIdx++) {
        if (config.slotDensity > 1 && slotIdx % config.slotDensity !== 0) continue
        // Stagger slots across days/weeks instead of filling every cell
        if ((wi + slotIdx + DAY_NAMES.indexOf(dayName)) % 4 !== 0) continue

        const [startTime, endTime] = SLOTS_30MIN[slotIdx]
        const key = slotKey(dayName, date, startTime)
        if (occupied.has(key)) continue

        const program = PROGRAMS[(year + week.monday.charCodeAt(0) + DAY_NAMES.indexOf(dayName) + slotIdx) % PROGRAMS.length]
        const baseEp = 100 + (id % 900)
        const spanWeeks = 2 + (id % 3)
        const endDate = addDays(date, (spanWeeks - 1) * 7)
        const segments = Array.from({ length: spanWeeks }, (_, i) => baseEp + i)

        occupied.add(key)
        events.push({
          id: `bulk_${quarter}_${id++}`,
          title: program.title,
          programId: program.id,
          dayName,
          startDate: date,
          endDate,
          startTime,
          endTime,
          color: calendarColors[program.id] ?? '#3498db',
          segments,
          warning: false,
          generated: true,
          conflictFree: true,
          quarter,
        })

        sinceYield++
        if (config.chunkDelayMs > 0 && sinceYield % 40 === 0) {
          await sleep(config.chunkDelayMs)
        }
      }
    }
  }

  quarterCache.set(cacheKey, events)
  return events
}

export function getQuarterDateRange(quarter) {
  const [qStr, yStr] = quarter.split('Q')
  const q = Number(qStr)
  const year = 2000 + Number(yStr)
  const startMonth = (q - 1) * 3
  const rangeStart = q === 1
    ? `${year - 1}-12-29`
    : new Date(year, startMonth, 1).toISOString().slice(0, 10)
  const rangeEnd = new Date(year, startMonth + 3, 0).toISOString().slice(0, 10)
  return { rangeStart, rangeEnd }
}

export function getQuarterYearLabel(quarter) {
  const [, yStr] = quarter.split('Q')
  return 2000 + Number(yStr)
}

export function quarterInBulkYears(quarter, years) {
  return years.includes(getQuarterYearLabel(quarter))
}

export function filterEventsByQuarters(events, quarters) {
  if (!quarters?.length) return events
  const ranges = quarters.map(getQuarterDateRange)
  const minStart = ranges.map((r) => r.rangeStart).sort()[0]
  const maxEnd = ranges.map((r) => r.rangeEnd).sort().reverse()[0]
  return events.filter((e) => e.startDate <= maxEnd && e.endDate >= minStart)
}

export function countConflicts(events) {
  let count = 0
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i]
      const b = events[j]
      if (a.dayName === b.dayName && timesOverlap(a, b) && datesOverlap(a, b)) count++
    }
  }
  return count
}

export function clearBulkCache() {
  quarterCache.clear()
  seedOccupied = null
}

/** @deprecated Use generateBulkForQuarter — kept for stats only */
export function generateBulkBroadcastEvents() {
  return []
}
