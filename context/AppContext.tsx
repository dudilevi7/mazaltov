'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { Todo } from '../types/Todo'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { LanguageDirection } from '@/types/General'
import { MAZAL_TOV_TODOS_KEY, MAZAL_TOV_SIDEBAR_OPEN_KEY } from '@/constants/localStorage'
import { EventSettings, EventType } from '@/types/Settings'
import { ShowToastParams, ToastData, ToastType } from '@/types/Toast'
import Toast from '@/components/Toast'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'

interface AppContextType {
  languageDirection: LanguageDirection
  setLanguageDirection: (direction: LanguageDirection) => void
  rowDirectionClassName: string
  eventSettings: EventSettings
  eventSettingsVersion: number
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: number, todo: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  removeTodo: (id: number) => void
  updateEventSettings: (updates: Partial<EventSettings>) => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toast: ToastData | null
  showToast: (params: ShowToastParams) => void
  hideToast: () => void
  isLoadingEventSettings: boolean
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
  eventSettingsVersion: 0,
  todos: [],
  setTodos: () => {},
  addTodo: () => {},
  updateTodo: () => {},
  removeTodo: () => {},
  updateEventSettings: () => {},
  isSidebarOpen: true,
  setSidebarOpen: () => {},
  toast: null,
  showToast: () => {},
  hideToast: () => {},
  isLoadingEventSettings: false,
})

const getDefaultEventSettings = (): EventSettings => {
  const generateEventId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '')
  return {
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
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const [todos, setTodos] = useState<Todo[]>([])
  const [languageDirection, setLanguageDirection] = useState<LanguageDirection>(LanguageDirection.HEB)
  const [rowDirectionClassName, setRowDirectionClassName] = useState<string>('flex-row-reverse')
  const defaultEventSettings = getDefaultEventSettings()
  const [eventSettings, setEventSettings] = useState<EventSettings>(defaultEventSettings)
  const [eventSettingsVersion, setEventSettingsVersion] = useState(0)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [isLoadingEventSettings, setIsLoadingEventSettings] = useState<boolean>(false)

  const showToast = (params: ShowToastParams) => {
    setToast({ ...params, id: Date.now() })
  }

  const hideToast = () => setToast(null)

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
  }, [])

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return

    fetchEvents()
  }, [user?.id, isAuthLoading, isAuthenticated])

  useEffect(() => {
    setRowDirectionClassName(languageDirection === LanguageDirection.HEB ? 'flex-row-reverse' : 'flex-row')
  }, [languageDirection])

  const fetchEvents = async () => {
    if (!user?.id) return
    setIsLoadingEventSettings(true)
    try {
      const data = await fetchData<unknown, EventSettings>({
        url: '/api/event',
        method: METHODS.GET,
      })
      setEventSettings(data)
      setEventSettingsVersion((v) => v + 1)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message.includes('404')) {
        try {
          const created = await fetchData<EventSettings, EventSettings>({
            url: '/api/event',
            method: METHODS.POST,
            body: defaultEventSettings,
          })
          setEventSettings(created)
          setEventSettingsVersion((v) => v + 1)
        } catch {
          showToast({
            type: ToastType.ERROR,
            title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
            message: languageDirection === LanguageDirection.HEB ? 'שגיאה ביצירת אירוע' : 'Failed to create event',
          })
        }
      }
    } finally {
      setIsLoadingEventSettings(false)
    }
  }
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
        eventSettingsVersion,
        updateEventSettings,
        isSidebarOpen,
        setSidebarOpen,
        toast,
        showToast,
        hideToast,
        isLoadingEventSettings,
      }}>
      {children}
      <Toast />
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
