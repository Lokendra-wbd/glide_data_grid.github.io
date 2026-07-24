import { SLOT_HEIGHT, TIME_LABEL_WIDTH, formatTimeLabel, slotStart } from '../../utils/broadcastCalendar'

export default function TimeSlotLabels({ dayName, timeSlots }) {
  return (
    <div className="flex flex-col border-r border-gray-300 bg-[#fafafa]">
      {timeSlots.map((slot) => (
        <div
          key={`${dayName}-${slotStart(slot)}`}
          className="border-b border-gray-200 px-1 pt-1"
          style={{ height: SLOT_HEIGHT, width: TIME_LABEL_WIDTH }}
        >
          <span className="block whitespace-nowrap text-[10px] leading-none text-gray-500">
            {formatTimeLabel(slotStart(slot))}
          </span>
        </div>
      ))}
    </div>
  )
}
