'use client'

import Calender from '@/components/Calendar'
import { CalendarProvider } from '@/context/CalendarContext'

const CalendarPage = () => {
  return (
    <CalendarProvider>
      <Calender />
    </CalendarProvider>
  )
}

export default CalendarPage
