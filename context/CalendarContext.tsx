'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import type { Todo } from '@/types/Todo'
import { getDateKey, getTodosByDate } from '@/components/Calendar/helper'

interface CalendarContextType {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  todosByDate: Record<string, Todo[]>
  todosForSelectedDate: Todo[]
  languageDirection: LanguageDirection
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const { todos, languageDirection } = useAppContext()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const todosByDate = useMemo(() => getTodosByDate(todos), [todos])

  const todosForSelectedDate = useMemo(() => {
    const key = getDateKey(selectedDate)
    return todosByDate[key] || []
  }, [selectedDate, todosByDate])

  const value: CalendarContextType = {
    selectedDate,
    setSelectedDate,
    todosByDate,
    todosForSelectedDate,
    languageDirection,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendarContext must be used within CalendarProvider')
  }
  return context
}

export default CalendarProvider
