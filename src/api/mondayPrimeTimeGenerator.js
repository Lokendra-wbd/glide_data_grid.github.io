import { addDays } from '../utils/broadcastCalendar'
import { calendars } from './mockData'

const calendarColors = Object.fromEntries(calendars.map((c) => [c.id, c.backgroundColor]))

const PRIME_SLOTS = [
  ['08:00', '08:30'],
  ['08:30', '09:00'],
  ['09:00', '09:30'],
  ['09:30', '10:00'],
  ['10:00', '10:30'],
  ['10:30', '11:00'],
  ['11:00', '11:30'],
  ['11:30', '12:00'],
]

const MONDAY_PROGRAMS = [
  { id: 'baking', title: 'Baking Champ.' },
  { id: 'breakfast', title: 'Breakfast Wars' },
  { id: 'kitchen', title: 'Kitchen Stories' },
  { id: 'pastry', title: 'Pastry Masters' },
  { id: 'special', title: 'Chef Spotlight' },
  { id: 'baking', title: 'Sweet Treats' },
  { id: 'kitchen', title: 'Farm to Table' },
  { id: 'pastry', title: 'Brunch Bites' },
  { id: 'breakfast', title: 'Morning Feast' },
  { id: 'baking', title: 'Cupcake Wars' },
  { id: 'kitchen', title: 'Street Food Stories' },
  { id: 'special', title: 'Holiday Special' },
]

function listMondays(startYear, endYear) {
  const dates = []
  let cursor = `${startYear}-01-01`
  const end = `${endYear}-12-31`
  while (cursor <= end) {
    const d = new Date(`${cursor}T12:00:00`)
    if (d.getDay() === 1) dates.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return dates
}

/**
 * Fill every Monday prime-time slot (8:00–12:00) across two calendar years
 * with multi-week episodic blocks.
 */
export function generateMondayPrimeTimeEvents(startYear = 2027, endYear = 2028) {
  const mondays = listMondays(startYear, endYear)
  const events = []

  for (let slotIdx = 0; slotIdx < PRIME_SLOTS.length; slotIdx++) {
    const [startTime, endTime] = PRIME_SLOTS[slotIdx]
    let weekIdx = 0
    let programCursor = slotIdx

    while (weekIdx < mondays.length) {
      const spanWeeks = 2 + ((slotIdx + weekIdx) % 3)
      const endIdx = Math.min(weekIdx + spanWeeks, mondays.length)
      const program = MONDAY_PROGRAMS[programCursor % MONDAY_PROGRAMS.length]
      const baseEpisode = 100 + slotIdx * 200 + (weekIdx % 90)

      events.push({
        id: `mon_${startYear}_${slotIdx}_${weekIdx}`,
        title: program.title,
        programId: program.id,
        dayName: 'Monday',
        startDate: mondays[weekIdx],
        endDate: mondays[endIdx - 1],
        startTime,
        endTime,
        color: calendarColors[program.id] ?? '#3498db',
        segments: Array.from({ length: endIdx - weekIdx }, (_, i) => baseEpisode + i),
        warning: false,
        predefined: false,
        mondayFill: true,
      })

      weekIdx = endIdx
      programCursor += 1
    }
  }

  return events
}
