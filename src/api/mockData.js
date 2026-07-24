export const dayParts = [
  { id: 'prime_time', name: 'Prime Time (8:00-12:00 PM)', start: '08:00', end: '12:00' },
]

export const legendItems = [
  { id: 'borrow', label: 'Borrow', count: 1, color: '#3b82f6' },
  { id: 'return', label: 'Return', count: 3, color: '#22c55e' },
  { id: 'new', label: 'New', count: 2, color: '#f97316' },
  { id: 'special', label: 'Special/One-Off', count: null, color: '#ef4444' },
  { id: 'tbd', label: 'TBD', count: null, color: '#9ca3af' },
]

export const timelineDates = [
  { date: '12/29', month: 'Jan', quarter: '1Q27', highlighted: false },
  { date: '1/5', month: 'Jan', quarter: '1Q27', highlighted: false },
  { date: '1/12', month: 'Jan', quarter: '1Q27', highlighted: false },
  { date: '1/19', month: 'Jan', quarter: '1Q27', highlighted: true },
  { date: '2/2', month: 'Feb', quarter: '1Q27', highlighted: false },
  { date: '3/4', month: 'Mar', quarter: '1Q27', highlighted: false },
  { date: '4/1', month: 'Apr', quarter: '2Q27', highlighted: false },
  { date: '4/20', month: 'Apr', quarter: '2Q27', highlighted: true },
  { date: '5/18', month: 'May', quarter: '2Q27', highlighted: false },
  { date: '6/14', month: 'Jun', quarter: '2Q27', highlighted: true },
  { date: '7/12', month: 'Jul', quarter: '3Q27', highlighted: false },
  { date: '8/16', month: 'Aug', quarter: '3Q27', highlighted: true },
]

export const quickLinks = [
  { id: 'network', title: 'Network Setup', description: 'Configure network settings', icon: 'globe' },
  { id: 'rules', title: 'Rules Setup', description: 'Define scheduling rules', icon: 'rules' },
  { id: 'events', title: 'Event Setup', description: 'Manage event templates', icon: 'events' },
  { id: 'reports', title: 'Reports, Exports & Dashboards', description: 'View analytics and reports', icon: 'chart' },
  { id: 'content', title: 'Content Inventory Maintenance', description: 'Manage content inventory', icon: 'refresh' },
  { id: 'users', title: 'User Access', description: 'Manage user permissions', icon: 'users' },
]

export const gridCards = [
  {
    id: 'lrv',
    title: 'Glide Data Grid LRV',
    lastEdited: '4:18 PM',
    collaborators: ['user1', 'user2'],
    extraCount: 3,
    enabled: true,
  },
  {
    id: '24hr',
    title: '24hr Grid',
    lastEdited: '2:45 PM',
    collaborators: ['user1', 'user2'],
    extraCount: 1,
    enabled: false,
  },
]

export const calendars = [
  { id: 'baking', name: 'Baking Champ.', backgroundColor: '#f5a623', borderColor: '#e09512', color: '#333' },
  { id: 'breakfast', name: 'Breakfast Wars', backgroundColor: '#7ec8e3', borderColor: '#5eb8d9', color: '#333' },
  { id: 'tbd', name: 'TBD', backgroundColor: '#f4a6c1', borderColor: '#e88aab', color: '#333' },
  { id: 'kitchen', name: 'Kitchen Stories', backgroundColor: '#7ec8e3', borderColor: '#5eb8d9', color: '#333' },
  { id: 'pastry', name: 'Pastry Masters', backgroundColor: '#a8d5a2', borderColor: '#8bc486', color: '#333' },
  { id: 'special', name: 'Special', backgroundColor: '#f97316', borderColor: '#ea580c', color: '#fff' },
]

const calendarColors = Object.fromEntries(
  calendars.map((cal) => [cal.id, cal.backgroundColor]),
)

function weeklyEvent(id, title, calendarId, dayOfWeek, startTime, endTime, startDate, endDate, segments) {
  const events = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  const current = new Date(start)
  while (current.getDay() !== dayOfWeek) current.setDate(current.getDate() + 1)

  let segIndex = 0
  while (current <= end) {
    const seg = segments[segIndex] ?? segments[segments.length - 1]
    const dateStr = current.toISOString().slice(0, 10)

    events.push({
      guid: `${id}_${dateStr}`,
      title: `${title} (${seg})`,
      date: dateStr,
      start: startTime,
      end: endTime,
      color: calendarColors[calendarId] ?? '#3498db',
      type: calendarId,
      program: title,
      segment: seg,
      description: `Program: ${title}, Segment: ${seg}`,
    })

    current.setDate(current.getDate() + 7)
    segIndex = Math.min(segIndex + 1, segments.length - 1)
  }
  return events
}

export const rawEvents = [
  ...weeklyEvent(
    'baking',
    'Baking Champ.',
    'baking',
    1,
    '09:30',
    '11:30',
    '2027-01-19',
    '2027-04-01',
    [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216],
  ),
  ...weeklyEvent(
    'breakfast1',
    'Breakfast Wars',
    'breakfast',
    2,
    '08:00',
    '09:00',
    '2027-04-06',
    '2027-05-27',
    [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
  ),
  ...weeklyEvent(
    'breakfast2',
    'Breakfast Wars',
    'breakfast',
    2,
    '08:00',
    '09:00',
    '2027-08-03',
    '2027-08-17',
    [112, 113],
  ),
  ...weeklyEvent(
    'tbd',
    'TBD',
    'tbd',
    2,
    '10:00',
    '11:00',
    '2027-03-03',
    '2027-06-02',
    [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112],
  ),
  ...weeklyEvent(
    'kitchen',
    'Kitchen Stories',
    'kitchen',
    2,
    '10:00',
    '11:00',
    '2027-06-03',
    '2027-08-12',
    [102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113],
  ),
  ...weeklyEvent(
    'pastry',
    'Pastry Masters',
    'pastry',
    3,
    '08:30',
    '09:30',
    '2027-02-17',
    '2027-04-07',
    [105, 106, 107, 108, 109, 110, 111, 112, 113],
  ),
  {
    guid: 'americas250',
    title: "America's 250th Week",
    date: '2027-02-15',
    start: '08:00',
    end: '12:00',
    color: calendarColors.special,
    type: 'special',
    readonly: true,
    description: "America's 250th Week — 1Q27",
  },
]
