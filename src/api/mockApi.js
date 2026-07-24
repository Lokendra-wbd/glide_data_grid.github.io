import { generateWeeksForQuarter } from '../utils/broadcastCalendar'
import { getDataConfig } from '../config/env'
import {
  broadcastEvents,
  quarterOrder,
  programDefaults,
  airDates,
  programNames,
  networks,
  durations,
  startTimes,
  specialBanners,
} from './broadcastMockData'
import {
  generateBulkForQuarter,
  filterEventsByQuarters,
  countConflicts,
  quarterInBulkYears,
} from './bulkDataGenerator'
import { dayParts, legendItems, quickLinks, gridCards, calendars } from './mockData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const userEvents = []
const historyLog = []

async function loadBulkForQuarters(quarters) {
  const config = getDataConfig()
  if (!config.bulkEnabled) return []

  const bulk = []
  for (const quarter of quarters) {
    if (!quarterInBulkYears(quarter, config.bulkYears)) continue
    const chunk = await generateBulkForQuarter(quarter, broadcastEvents, config)
    bulk.push(...chunk)
  }
  return bulk
}

function filterDayPart(events, dayPartId) {
  const part = dayParts.find((d) => d.id === dayPartId) ?? dayParts[0]
  const [partStartH] = part.start.split(':').map(Number)
  const [partEndH] = part.end.split(':').map(Number)
  return events.filter((event) => {
    const [startH] = event.startTime.split(':').map(Number)
    return startH >= partStartH && startH < partEndH
  })
}

function capEvents(events, max) {
  if (!max || events.length <= max) return events
  const seed = events.filter((e) => !e.generated)
  const bulk = events.filter((e) => e.generated)
  const seedCount = seed.length
  const bulkAllowance = Math.max(0, max - seedCount)
  return [...seed, ...bulk.slice(0, bulkAllowance)]
}

export async function fetchDayParts() {
  await delay(50)
  return [...dayParts]
}

export async function fetchLegend() {
  await delay(50)
  return [...legendItems]
}

export async function fetchQuickLinks() {
  await delay()
  return [...quickLinks]
}

export async function fetchGridCards() {
  await delay()
  return [...gridCards]
}

export async function fetchCalendars() {
  await delay()
  return [...calendars]
}

export async function fetchQuarterWeeks(quarter) {
  await delay(80)
  if (!/^\dQ\d{2}$/.test(quarter)) return []
  return generateWeeksForQuarter(quarter)
}

export async function fetchBroadcastEvents(dayPartId, quarters) {
  const config = getDataConfig()
  await delay(50)

  const bulk = await loadBulkForQuarters(quarters)
  const merged = [
    ...broadcastEvents,
    ...bulk,
    ...userEvents,
  ]

  const inQuarters = filterEventsByQuarters(merged, quarters)
  const inDayPart = filterDayPart(inQuarters, dayPartId)
  return capEvents(inDayPart, config.maxEventsPerFetch)
}

export async function fetchDataStats() {
  await delay(30)
  const config = getDataConfig()
  return {
    seedEvents: broadcastEvents.length,
    bulkEnabled: config.bulkEnabled,
    bulkYears: config.bulkYears,
    maxEventsPerFetch: config.maxEventsPerFetch,
    slotDensity: config.slotDensity,
    chunkDelayMs: config.chunkDelayMs,
    seedConflicts: countConflicts(broadcastEvents),
    userEvents: userEvents.length,
  }
}

export async function fetchProgramDefaults(event) {
  await delay(100)
  if (!event || !event.title) {
    return {
      ...programDefaults,
      telecastStart: event?.startDate ?? programDefaults.telecastStart,
      telecastEnd: event?.endDate ?? programDefaults.telecastEnd,
      startTime: event?.startTime ?? programDefaults.startTime,
    }
  }
  return {
    ...programDefaults,
    programName: event.title,
    telecastStart: event.startDate,
    telecastEnd: event.endDate,
    startTime: event.startTime,
    workingTitle: event.title,
  }
}

export async function fetchAirDates() {
  await delay(50)
  return [...airDates]
}

export async function fetchProgramNames() {
  await delay(30)
  return [...programNames]
}

export async function fetchNetworks() {
  await delay(30)
  return [...networks]
}

export async function fetchFormOptions() {
  await delay(30)
  return { durations: [...durations], startTimes: [...startTimes] }
}

export async function fetchSpecialBanners() {
  await delay(30)
  return [...specialBanners]
}

export async function saveBroadcastEvent(event, action = 'update') {
  await delay(100)
  const idx = userEvents.findIndex((e) => e.id === event.id)
  const seedIdx = broadcastEvents.findIndex((e) => e.id === event.id)
  if (seedIdx >= 0) {
    broadcastEvents[seedIdx] = event
  } else if (idx >= 0) {
    userEvents[idx] = event
  } else {
    userEvents.push(event)
  }
  historyLog.unshift({
    id: `hist_${Date.now()}`,
    action,
    eventId: event.id,
    title: event.title,
    timestamp: new Date().toISOString(),
  })
  return event
}

export async function deleteBroadcastEvent(eventId) {
  await delay(100)
  const idx = userEvents.findIndex((e) => e.id === eventId)
  if (idx >= 0) {
    const removed = userEvents.splice(idx, 1)[0]
    historyLog.unshift({ id: `hist_${Date.now()}`, action: 'delete', eventId, title: removed.title, timestamp: new Date().toISOString() })
    return true
  }
  return false
}

export async function fetchHistoryLog() {
  await delay(50)
  return [...historyLog]
}

export async function fetchUser() {
  await delay(50)
  const hour = new Date().getHours()
  let greeting = 'Good Evening'
  if (hour < 12) greeting = 'Good Morning'
  else if (hour < 17) greeting = 'Good Afternoon'
  return { name: 'Libby', greeting, initials: 'CN', avatar: null }
}

export { quarterOrder }
