import { calendars } from './mockData'
import { generateMondayPrimeTimeEvents } from './mondayPrimeTimeGenerator'

const calendarColors = Object.fromEntries(calendars.map((c) => [c.id, c.backgroundColor]))

function block(id, title, programId, dayName, startTime, endTime, startDate, endDate, segments, extra = {}) {
  return {
    id,
    title,
    programId,
    dayName,
    startDate,
    endDate,
    startTime,
    endTime,
    color: calendarColors[programId] ?? '#3498db',
    segments,
    warning: false,
    predefined: false,
    ...extra,
  }
}

function eps(from, count) {
  return Array.from({ length: count }, (_, i) => from + i)
}

export const broadcastEvents = [
  // Tuesday–Sunday seed blocks (Monday filled programmatically for 2027–2028)
  block('breakfast1', 'Breakfast Wars', 'breakfast', 'Tuesday', '08:00', '08:30', '2027-03-30', '2027-06-29', eps(101, 13)),
  block('breakfast2', 'Breakfast Wars', 'breakfast', 'Tuesday', '08:00', '08:30', '2027-08-03', '2027-08-17', eps(112, 2), { warning: true }),
  block('breakfast3', 'Breakfast Wars', 'breakfast', 'Tuesday', '09:00', '09:30', '2027-01-19', '2027-02-16', eps(201, 5)),
  // 60-min — title shared across 2 time slots
  block('breakfast60', 'Breakfast Wars', 'breakfast', 'Tuesday', '10:00', '11:00', '2027-02-17', '2027-03-10', eps(301, 4)),

  // Conflicts
  block('tbd', 'TBD', 'tbd', 'Tuesday', '10:00', '10:30', '2027-05-04', '2027-06-08', eps(301, 6), { warning: true, predefined: true }),
  block('kitchen', 'Kitchen Stories', 'kitchen', 'Tuesday', '10:00', '10:30', '2027-05-18', '2027-07-06', eps(102, 7)),
  block('kitchen2', 'Kitchen Stories', 'kitchen', 'Tuesday', '11:00', '11:30', '2027-02-10', '2027-03-10', eps(401, 5)),

  // Wednesday
  block('pastry_a', 'Pastry Masters', 'pastry', 'Wednesday', '08:00', '08:30', '2027-02-17', '2027-03-10', eps(105, 4)),
  block('pastry_b', 'Pastry Masters', 'pastry', 'Wednesday', '09:30', '10:00', '2027-04-21', '2027-05-12', eps(109, 4)),
  block('spotlight_w', 'Chef Spotlight', 'special', 'Wednesday', '10:30', '11:00', '2027-07-07', '2027-08-04', eps(501, 5)),
  block('cupcake', 'Cupcake Wars', 'baking', 'Wednesday', '11:00', '11:30', '2027-09-08', '2027-10-06', eps(601, 5)),

  // Thursday
  block('grill', 'Weekend Grill', 'special', 'Thursday', '08:30', '09:00', '2027-01-26', '2027-02-16', eps(201, 4)),
  block('winter', 'Winter Kitchen', 'kitchen', 'Thursday', '09:30', '10:00', '2027-09-07', '2027-10-05', eps(1101, 5)),
  block('street', 'Street Food Stories', 'kitchen', 'Thursday', '10:00', '10:30', '2027-04-08', '2027-05-06', eps(701, 5)),
  block('morning', 'Morning Feast', 'breakfast', 'Thursday', '11:00', '11:30', '2027-06-11', '2027-07-09', eps(801, 5)),

  // Friday
  block('dinner', 'Friday Night Dinner', 'kitchen', 'Friday', '08:00', '08:30', '2027-03-08', '2027-04-05', eps(401, 5)),
  block('valentine', 'Valentine Sweets', 'baking', 'Friday', '09:30', '10:00', '2028-02-07', '2028-02-28', eps(1201, 4)),
  block('holiday_f', 'Holiday Special', 'special', 'Friday', '10:30', '11:00', '2027-11-12', '2027-12-10', eps(901, 5), { predefined: true }),

  // Saturday
  block('sweets', 'Sweet Treats', 'baking', 'Saturday', '08:00', '08:30', '2027-01-26', '2027-02-23', eps(501, 5)),
  block('brunchbites', 'Brunch Bites', 'pastry', 'Saturday', '09:00', '09:30', '2027-07-10', '2027-08-07', eps(801, 5)),
  block('farm_sat', 'Farm to Table', 'kitchen', 'Saturday', '10:00', '10:30', '2027-05-15', '2027-06-12', eps(901, 5)),

  // Sunday
  block('brunch', 'Sunday Brunch', 'breakfast', 'Sunday', '09:00', '09:30', '2027-02-07', '2027-03-07', eps(301, 5)),
  block('holiday', 'Holiday Bake-Off', 'baking', 'Sunday', '10:00', '10:30', '2027-11-14', '2027-12-05', eps(901, 4)),
  block('newyear', 'New Year Brunch', 'breakfast', 'Sunday', '11:00', '11:30', '2028-01-10', '2028-01-31', eps(1001, 4)),

  block('breakfast4', 'Breakfast Wars', 'breakfast', 'Tuesday', '08:30', '09:00', '2027-04-14', '2027-05-05', eps(115, 4)),
  block('breakfast5', 'Breakfast Wars', 'breakfast', 'Tuesday', '09:30', '10:00', '2027-06-16', '2027-07-07', eps(120, 4)),
  block('breakfast6', 'Breakfast Wars', 'breakfast', 'Tuesday', '11:00', '11:30', '2027-09-15', '2027-10-06', eps(125, 4)),
  block('breakfast7', 'Breakfast Wars', 'breakfast', 'Tuesday', '11:30', '12:00', '2027-01-05', '2027-01-26', eps(130, 4)),

  block('kitchen3', 'Kitchen Stories', 'kitchen', 'Tuesday', '08:00', '08:30', '2027-03-23', '2027-04-13', eps(105, 4)),
  block('kitchen4', 'Kitchen Stories', 'kitchen', 'Tuesday', '09:00', '09:30', '2027-07-21', '2027-08-11', eps(110, 4)),

  block('pastry_c', 'Pastry Masters', 'pastry', 'Wednesday', '08:30', '09:00', '2027-01-12', '2027-02-02', eps(106, 4)),
  block('pastry_d', 'Pastry Masters', 'pastry', 'Wednesday', '09:00', '09:30', '2027-05-20', '2027-06-10', eps(110, 4)),
  block('pastry_e', 'Pastry Masters', 'pastry', 'Wednesday', '11:30', '12:00', '2027-10-14', '2027-11-04', eps(115, 4)),

  block('cupcake2', 'Cupcake Wars', 'baking', 'Wednesday', '08:00', '08:30', '2027-03-03', '2027-03-24', eps(610, 4)),
  block('spotlight2', 'Chef Spotlight', 'special', 'Wednesday', '11:00', '11:30', '2027-02-03', '2027-02-24', eps(510, 4)),

  block('grill2', 'Weekend Grill', 'special', 'Thursday', '08:00', '08:30', '2027-04-15', '2027-05-06', eps(205, 4)),
  block('grill3', 'Weekend Grill', 'special', 'Thursday', '10:30', '11:00', '2027-07-16', '2027-08-06', eps(210, 4)),
  block('street2', 'Street Food Stories', 'kitchen', 'Thursday', '08:00', '08:30', '2027-08-20', '2027-09-10', eps(705, 4)),
  block('morning2', 'Morning Feast', 'breakfast', 'Thursday', '09:00', '09:30', '2027-01-07', '2027-01-28', eps(805, 4)),
  block('winter2', 'Winter Kitchen', 'kitchen', 'Thursday', '11:30', '12:00', '2027-11-05', '2027-11-26', eps(1105, 4)),

  block('dinner2', 'Friday Night Dinner', 'kitchen', 'Friday', '08:30', '09:00', '2027-06-04', '2027-06-25', eps(405, 4)),
  block('dinner3', 'Friday Night Dinner', 'kitchen', 'Friday', '10:00', '10:30', '2027-09-04', '2027-09-25', eps(410, 4)),
  block('valentine2', 'Valentine Sweets', 'baking', 'Friday', '11:00', '11:30', '2027-02-14', '2027-03-07', eps(1205, 4)),

  block('sweets2', 'Sweet Treats', 'baking', 'Saturday', '08:30', '09:00', '2027-04-03', '2027-04-24', eps(505, 4)),
  block('sweets3', 'Sweet Treats', 'baking', 'Saturday', '10:30', '11:00', '2027-08-08', '2027-08-29', eps(510, 4)),
  block('brunchbites2', 'Brunch Bites', 'pastry', 'Saturday', '11:00', '11:30', '2027-03-13', '2027-04-03', eps(805, 4)),
  block('farm_sat2', 'Farm to Table', 'kitchen', 'Saturday', '11:30', '12:00', '2027-10-10', '2027-10-31', eps(905, 4)),

  block('brunch2', 'Sunday Brunch', 'breakfast', 'Sunday', '08:00', '08:30', '2027-04-05', '2027-04-26', eps(305, 4)),
  block('brunch3', 'Sunday Brunch', 'breakfast', 'Sunday', '10:30', '11:00', '2027-07-05', '2027-07-26', eps(310, 4)),
  block('holiday2', 'Holiday Bake-Off', 'baking', 'Sunday', '11:30', '12:00', '2027-12-08', '2027-12-29', eps(905, 4)),
  block('newyear2', 'New Year Brunch', 'breakfast', 'Sunday', '08:30', '09:00', '2027-05-10', '2027-05-31', eps(1005, 4)),

  // Every Monday prime-time slot, 2027–2028 (~280 multi-week blocks)
  ...generateMondayPrimeTimeEvents(2027, 2028),
]

export const quarterOrder = ['1Q27', '2Q27', '3Q27', '4Q27', '1Q28', '2Q28', '3Q28', '4Q28']

export const programDefaults = {
  programType: 'Series',
  programName: 'Baking Champ.',
  season: '2',
  episodes: '20',
  telecastStart: '2028-01-02',
  telecastEnd: '2028-12-02',
  startTime: '20:00',
  duration: '30',
  exhibitionsAllowed: 4,
  exhibitionsUsed: 1,
  flags: {
    doNotAir: true,
    doNotPublish: false,
    runOrderConfirmed: true,
    publishCustomerSeason: false,
  },
  titleType: 'working',
  workingTitle: '',
  lpStart: '2028-01-02',
  lpEnd: '2028-12-02',
  primaryNetwork: 'Food',
  authorizedNetworks: '',
  deliveryDate: '2028-01-02',
  deliveryNotConfirmed: true,
  notes: 'Carnival Cruise season long integration (prize sponsorship); plus one Golden Gift',
  tagType: 'episode',
  tagEpisode: '',
}

export const airDates = [
  { episode: 210, date: '2/23', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 209, date: '3/2', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 208, date: '3/9', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 207, date: '3/16', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 206, date: '3/23', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 205, date: '3/30', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 204, date: '4/6', time: '20:00', network: 'US National', totalAirings: 4 },
  { episode: 203, date: '4/13', time: '20:00', network: 'US National', totalAirings: 4 },
]

export const programNames = ['Baking Champ.', 'Breakfast Wars', 'Kitchen Stories', 'Pastry Masters', 'TBD']
export const networks = ['Food', 'US National', 'Cooking Channel', 'Discovery+']
export const durations = ['30', '60', '90', '120']
export const startTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '20:00']

export const specialBanners = [
  { id: 'americas250', label: "America's 250th Week", quarter: '1Q27', startWeek: 2, spanWeeks: 6, color: '#f5a623' },
]
