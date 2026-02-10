'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'

const CalendarHeader = () => (
  <div className="flex flex-row items-center gap-1 w-fit rounded-md">
    <FontAwesomeIcon icon={faCalendar} className="text-lg text-gray-700" />
    <span className="text-base font-semibold text-gray-700">לוח שנה</span>
  </div>
)

export default CalendarHeader
