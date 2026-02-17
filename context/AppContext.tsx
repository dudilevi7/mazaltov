'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { Todo } from '../types/Todo'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { LanguageDirection } from '@/types/General'
import {
  MAZAL_TOV_TODOS_KEY,
  MAZAL_TOV_EVENT_SETTINGS_KEY,
  MAZAL_TOV_SIDEBAR_OPEN_KEY,
} from '@/constants/localStorage'
import { EventSettings, EventType } from '@/types/Settings'

interface AppContextType {
  languageDirection: LanguageDirection
  setLanguageDirection: (direction: LanguageDirection) => void
  rowDirectionClassName: string
  eventSettings: EventSettings
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: number, todo: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  removeTodo: (id: number) => void
  updateEventSettings: (updates: Partial<EventSettings>) => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}
export const AppContext = createContext<AppContextType>({
  languageDirection: LanguageDirection.HEB,
  setLanguageDirection: () => {},
  rowDirectionClassName: '',
  eventSettings: {
    eventId: '',
    eventType: EventType.WEDDING,
    ownerName: '',
    brideName: '',
    groomName: '',
    bridePhone: '',
    groomPhone: '',
    ownerPhone: '',
    customEventType: '',
    eventHall: '',
    eventDate: '',
  },
  todos: [],
  setTodos: () => {},
  addTodo: () => {},
  updateTodo: () => {},
  removeTodo: () => {},
  updateEventSettings: () => {},
  isSidebarOpen: true,
  setSidebarOpen: () => {},
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [languageDirection, setLanguageDirection] = useState<LanguageDirection>(LanguageDirection.HEB)
  const [rowDirectionClassName, setRowDirectionClassName] = useState<string>('flex-row-reverse')
  const generateEventId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ''
  const defaultEventSettings: EventSettings = {
    eventId: generateEventId(),
    eventType: EventType.WEDDING,
    ownerName: '',
    brideName: '',
    groomName: '',
    bridePhone: '',
    groomPhone: '',
    ownerPhone: '',
    customEventType: '',
    eventHall: '',
    eventDate: '',
  }
  const [eventSettings, setEventSettings] = useState<EventSettings>(defaultEventSettings)
  const [isSidebarOpen, setSidebarOpenState] = useState<boolean>(() => {
    const stored = getFromLocalStorage(MAZAL_TOV_SIDEBAR_OPEN_KEY, null)
    return stored !== null ? stored : true
  })

  const setSidebarOpen = (open: boolean) => {
    setSidebarOpenState(open)
    setToLocalStorage(MAZAL_TOV_SIDEBAR_OPEN_KEY, open)
  }

  useEffect(() => {
    setTodos(getFromLocalStorage(MAZAL_TOV_TODOS_KEY, []))
    const stored = getFromLocalStorage(MAZAL_TOV_EVENT_SETTINGS_KEY, defaultEventSettings)
    const eventId = stored?.eventId?.trim() || generateEventId()
    const withEventId = { ...defaultEventSettings, ...stored, eventId }
    setEventSettings(withEventId)
    if (!stored?.eventId?.trim()) {
      setToLocalStorage(MAZAL_TOV_EVENT_SETTINGS_KEY, withEventId)
    }
  }, [])

  useEffect(() => {
    setRowDirectionClassName(languageDirection === LanguageDirection.HEB ? 'flex-row-reverse' : 'flex-row')
  }, [languageDirection])

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newTodo: Todo = {
      ...todo,
      id: now,
      createdAt: now,
      updatedAt: now,
    }
    const newTodos = [...todos, newTodo]
    setTodos(newTodos)
    setToLocalStorage(MAZAL_TOV_TODOS_KEY, newTodos)
  }

  const updateTodo = (id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    const now = Date.now()
    const updatedTodos = todos.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: now } : t))
    setTodos(updatedTodos)
    setToLocalStorage(MAZAL_TOV_TODOS_KEY, updatedTodos)
  }

  const removeTodo = (id: number) => {
    const updatedTodos = todos.filter((t) => t.id !== id)
    setTodos(updatedTodos)
    setToLocalStorage(MAZAL_TOV_TODOS_KEY, updatedTodos)
  }

  const updateEventSettings = (updates: Partial<EventSettings>) => {
    setEventSettings((prev) => {
      const nextSettings = { ...prev, ...updates }
      setToLocalStorage(MAZAL_TOV_EVENT_SETTINGS_KEY, nextSettings)
      return nextSettings
    })
  }

  return (
    <AppContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        updateTodo,
        removeTodo,
        languageDirection,
        setLanguageDirection,
        rowDirectionClassName,
        eventSettings,
        updateEventSettings,
        isSidebarOpen,
        setSidebarOpen,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext has an error')
  }
  return context
}

export default AppProvider
