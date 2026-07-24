import { WEEK_COL_WIDTH, EVENT_TITLE_HEIGHT } from '../../utils/broadcastCalendar'

export default function ConflictOverlay({ region }) {
  const colorA = region.eventA?.color ?? '#f9a8d4'
  const colorB = region.eventB?.color ?? '#93c5fd'
  const titleHeight = EVENT_TITLE_HEIGHT

  return (
    <div
      className="pointer-events-none absolute z-[25] overflow-hidden rounded-sm border-2 border-dashed border-red-500"
      style={{
        left: region.left,
        top: region.top,
        width: region.width,
        height: region.height,
        background: `repeating-linear-gradient(135deg, ${colorA}99 0px, ${colorA}99 8px, ${colorB}99 8px, ${colorB}99 16px)`,
      }}
      aria-label={`Conflict between ${region.eventA?.title} and ${region.eventB?.title}`}
    >
      <div className="flex h-full" style={{ paddingTop: titleHeight }}>
        {region.overlapCells?.map((cell) => (
          <div
            key={`conflict-cell-${cell.weekIndex}`}
            className="flex flex-1 flex-col items-center justify-center border-r border-red-300/50 text-[9px] font-bold last:border-r-0"
            style={{ width: WEEK_COL_WIDTH }}
          >
            {cell.segmentA != null && (
              <span style={{ color: region.eventA?.color ? '#831843' : '#9f1239' }}>{cell.segmentA}</span>
            )}
            {cell.segmentB != null && (
              <span style={{ color: region.eventB?.color ? '#1e3a8a' : '#1e40af' }}>{cell.segmentB}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
