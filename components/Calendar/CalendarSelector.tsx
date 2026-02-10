'use client'

import Calendar from 'react-calendar'
import { useCalendarContext } from '@/context/CalendarContext'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { getTileClassName } from './helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CalendarSelector = () => {
  const { selectedDate, setSelectedDate, todosByDate } = useCalendarContext()
  const { languageDirection } = useAppContext()

  const locale = languageDirection === LanguageDirection.HEB ? 'he-IL' : 'en-US'

  const handleDayClick = (value: Date) => {
    if (value instanceof Date) setSelectedDate(value)
  }

  return (
    <div className="flex justify-center md:w-4/6">
      <Calendar
        onChange={(value) => handleDayClick(value as Date)}
        value={selectedDate}
        locale={locale}
        prev2Label={null}
        next2Label={null}
        nextLabel={
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs"
          />
        }
        prevLabel={
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs"
          />
        }
        navigationLabel={({ label }) => (
          <span className="text-base font-semibold text-gray-800">{label}</span>
        )}
        defaultView="month"
        calendarType={languageDirection === LanguageDirection.HEB ? 'hebrew' : 'gregory'}
        onClickDay={handleDayClick}
        className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
        tileClassName={({ date }) => getTileClassName({ date, todosByDate, selectedDate })}
      />
    </div>
  )
}

export default CalendarSelector
