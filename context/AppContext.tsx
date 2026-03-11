'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { Todo } from '../types/Todo'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { LanguageDirection } from '@/types/General'
import { MAZAL_TOV_SIDEBAR_OPEN_KEY } from '@/constants/localStorage'
import { EventSettings, EventType } from '@/types/Settings'
import { ShowToastParams, ToastData, ToastType } from '@/types/Toast'
import Toast from '@/components/Toast'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'

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
  isLoadingTodos: boolean
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
  isLoadingTodos: false,
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
  const [isLoadingTodos, setIsLoadingTodos] = useState<boolean>(false)

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
    if (isAuthLoading || !isAuthenticated) return

    fetchEvents()
    fetchTasks()
  }, [user?.id, isAuthLoading, isAuthenticated])

  useEffect(() => {
    setRowDirectionClassName(languageDirection === LanguageDirection.HEB ? 'flex-row-reverse' : 'flex-row')
  }, [languageDirection])

  const fetchEvents = async () => {
    if (!user?.id) return
    setIsLoadingEventSettings(true)
    try {
      const data = await fetchData<unknown, EventSettings>({
        url: `${API_URL}${API_ROUTES.EVENT}`,
        method: METHODS.GET,
      })
      setEventSettings(data)
      setEventSettingsVersion((v) => v + 1)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      showToast({
        type: ToastType.INFO,
        title: languageDirection === LanguageDirection.HEB ? 'הגדרות אירוע' : 'Event settings',
        message: languageDirection === LanguageDirection.HEB ? 'הוסף הגדרות אירוע ' : 'Add event settings',
      })
    } finally {
      setIsLoadingEventSettings(false)
    }
  }

  const fetchTasks = async () => {
    if (!user?.id) return
    setIsLoadingTodos(true)
    try {
      const data = await fetchData<unknown, Todo[]>({
        url: `${API_URL}${API_ROUTES.TASKS}`,
        method: METHODS.GET,
      })
      setTodos(Array.isArray(data) ? data : [])
    } catch {
      setTodos([])
    } finally {
      setIsLoadingTodos(false)
    }
  }

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>, Todo>({
        url: `${API_URL}${API_ROUTES.TASKS}`,
        method: METHODS.POST,
        body: todo,
      })
      setTodos((prev) => [...prev, created])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'משימה נוספה' : 'Task added',
        message: languageDirection === LanguageDirection.HEB ? 'משימה נוספה בהצלחה' : 'Task added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בהוספת משימה' : 'Failed to add task',
      })
    }
  }

  const updateTodo = async (id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    const existing = todos.find((t) => t.id === id)
    if (!existing) return
    const payload: Todo = { ...existing, ...updates, updatedAt: Date.now() }
    try {
      const updated = await fetchData<Todo, Todo>({
        url: `${API_URL}${API_ROUTES.TASKS}`,
        method: METHODS.PUT,
        body: payload,
      })
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'משימה עודכנה' : 'Task updated',
        message: languageDirection === LanguageDirection.HEB ? 'משימה עודכנה בהצלחה' : 'Task updated successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בעדכון משימה' : 'Failed to update task',
      })
    }
  }

  const removeTodo = async (id: number) => {
    try {
      const deleted = await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.TASKS}?id=${id}`,
        method: METHODS.DELETE,
      })
      setTodos((prev) => prev.filter((t) => t.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'משימה נמחקה' : 'Task deleted',
        message: languageDirection === LanguageDirection.HEB ? 'משימה נמחקה בהצלחה' : 'Task deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת משימה' : 'Failed to delete task',
      })
    }
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
        isLoadingTodos,
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
