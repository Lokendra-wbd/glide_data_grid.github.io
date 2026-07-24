import {
  DAY_LABEL_WIDTH,
  TIME_LABEL_WIDTH,
  WEEK_COL_WIDTH,
  buildHeaderRows,
  buildMonthSpans,
  buildQuarterSpans,
} from '../../utils/broadcastCalendar'

export default function CalendarHeader({
  weeks,
  selectedMonday,
  selectedQuarter,
  onSelectWeek,
  onSelectQuarter,
  scrollRef,
  zoom = 1,
  placeholderWeekCount = 0,
}) {
  const effectiveWeekCount = weeks.length || placeholderWeekCount
  if (!effectiveWeekCount) return null

  const headerRows = weeks.length
    ? buildHeaderRows(weeks, selectedMonday)
    : Array.from({ length: placeholderWeekCount }, (_, i) => ({
        quarter: selectedQuarter ?? '',
        month: '',
        date: '',
        monday: `placeholder-${i}`,
        selected: false,
        highlighted: false,
      }))
  const quarterSpans = weeks.length ? buildQuarterSpans(weeks) : [{ quarter: selectedQuarter ?? '', start: 0, count: placeholderWeekCount }]
  const monthSpans = weeks.length ? buildMonthSpans(weeks) : [{ month: '', key: 'placeholder', start: 0, count: placeholderWeekCount }]
  const gridWidth = effectiveWeekCount * WEEK_COL_WIDTH
  const year = weeks[0]?.monday?.slice(0, 4) ?? '2027'

  const scrollToWeek = (monday) => {
    const idx = weeks.findIndex((w) => w.monday === monday)
    if (idx >= 0 && scrollRef?.current) {
      const z = zoom ?? 1
      scrollRef.current.scrollLeft = idx * WEEK_COL_WIDTH * z
    }
  }

  return (
    <div className="border-b border-gray-300 bg-[#fafafa]" role="rowgroup" aria-label="Calendar timeline header">
      <div className="flex" style={{ minWidth: DAY_LABEL_WIDTH + TIME_LABEL_WIDTH + gridWidth }}>
        <div
          className="sticky left-0 z-30 shrink-0 border-r border-gray-300 bg-[#fafafa] px-2 py-1 text-[10px] text-gray-500"
          style={{ width: DAY_LABEL_WIDTH + TIME_LABEL_WIDTH }}
        >
          {year}
        </div>

        <div className="relative" style={{ width: gridWidth }}>
          <div className="flex h-5 border-b border-gray-200" role="row">
            {quarterSpans.map((span) => (
              <button
                key={`q-${span.quarter}-${span.start}`}
                type="button"
                role="gridcell"
                aria-selected={selectedQuarter === span.quarter}
                onClick={() => {
                  onSelectQuarter(span.quarter)
                  scrollToWeek(weeks[span.start]?.monday)
                }}
                className={`border-r border-gray-200 text-center text-[9px] font-medium transition ${
                  selectedQuarter === span.quarter
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
                style={{ width: span.count * WEEK_COL_WIDTH }}
              >
                {span.quarter}
              </button>
            ))}
          </div>

          <div className="relative h-5 border-b border-gray-200" role="row">
            <div
              className="absolute top-0.5 flex h-4 items-center rounded-sm bg-amber-400 px-2 text-[9px] font-medium text-black"
              style={{ left: WEEK_COL_WIDTH * 2, width: WEEK_COL_WIDTH * 6 }}
            >
              America&apos;s 250th Week
            </div>
          </div>

          <div className="flex h-5 border-b border-gray-200" role="row">
            {monthSpans.map((span) => (
              <div
                key={`m-${span.key}-${span.start}`}
                role="gridcell"
                className="border-r border-gray-200 text-center text-[9px] text-gray-500"
                style={{ width: span.count * WEEK_COL_WIDTH, lineHeight: '20px' }}
              >
                {span.month}
              </div>
            ))}
          </div>

          <div className="flex h-6" role="row">
            {headerRows.map((h, i) => (
              <button
                key={`week-hdr-${i}-${h.monday}`}
                type="button"
                role="gridcell"
                aria-label={`Week of ${h.date}`}
                aria-selected={h.selected}
                onClick={() => {
                  onSelectWeek(h.monday)
                  scrollToWeek(h.monday)
                }}
                className={`relative border-r border-gray-200 text-center text-[10px] transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset ${
                  h.selected
                    ? 'bg-gray-800 text-white'
                    : h.highlighted
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={{ width: WEEK_COL_WIDTH, lineHeight: '24px' }}
              >
                <span
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '5px solid #dc2626',
                  }}
                  aria-hidden="true"
                />
                {h.date}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
