'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Todo } from '../types/Todo'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { LanguageDirection } from '@/types/General'
import { MAZAL_TOV_SIDEBAR_OPEN_KEY, MAZAL_TOV_ACTIVE_EVENT_KEY } from '@/constants/localStorage'
import { EventSettings, EventType } from '@/types/Settings'
import type { AccessibleEvent, EventMember, EventRole } from '@/types/eventMember'
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
  accessibleEvents: AccessibleEvent[]
  activeEventId: string | null
  currentRole: EventRole | null
  setActiveEvent: (eventId: string) => void
  eventMembers: EventMember[]
  fetchEventMembers: (force?: boolean) => Promise<void>
  setEventMembers: (members: EventMember[]) => void
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
  accessibleEvents: [],
  activeEventId: null,
  currentRole: null,
  setActiveEvent: () => {},
  eventMembers: [],
  fetchEventMembers: async () => {},
  setEventMembers: () => {},
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
  const [accessibleEvents, setAccessibleEvents] = useState<AccessibleEvent[]>([])
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<EventRole | null>(null)
  const [eventMembers, setEventMembers] = useState<EventMember[]>([])
  const membersLoadedFor = useRef<string | null>(null)

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

    initializeApp()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const initializeApp = async () => {
    await initEventAccess()
    fetchEvents()
    fetchTasks()
  }

  const initEventAccess = async () => {
    if (!user?.id) return
    try {
      const accepted = await fetchData<unknown, { accepted: number }>({
        url: `${API_URL}${API_ROUTES.INVITE_ACCEPT}`,
        method: METHODS.POST,
      })
      // Newly linked invitations: reload once so all providers refetch with access.
      if (accepted?.accepted > 0 && typeof window !== 'undefined') {
        window.location.reload()
        return
      }
    } catch {
      // No pending invitations is fine.
    }
    try {
      const events = await fetchData<unknown, AccessibleEvent[]>({
        url: `${API_URL}${API_ROUTES.MY_EVENTS}`,
        method: METHODS.GET,
      })
      const list = Array.isArray(events) ? events : []
      setAccessibleEvents(list)

      let active = typeof window !== 'undefined' ? window.localStorage.getItem(MAZAL_TOV_ACTIVE_EVENT_KEY) : null
      if (!active || !list.some((e) => e.eventId === active)) {
        active = list.find((e) => e.isOwner)?.eventId ?? list[0]?.eventId ?? null
        if (typeof window !== 'undefined') {
          if (active) window.localStorage.setItem(MAZAL_TOV_ACTIVE_EVENT_KEY, active)
          else window.localStorage.removeItem(MAZAL_TOV_ACTIVE_EVENT_KEY)
        }
      }
      setActiveEventId(active)
      setCurrentRole(list.find((e) => e.eventId === active)?.role ?? null)
    } catch {
      setAccessibleEvents([])
    }
  }

  const setActiveEvent = (eventId: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(MAZAL_TOV_ACTIVE_EVENT_KEY, eventId)
    window.location.reload()
  }

  // Members are fetched once per active event and cached in context. Pass
  // force=true to refresh after an invite/remove mutation.
  const fetchEventMembers = async (force = false) => {
    if (!activeEventId) return
    if (!force && membersLoadedFor.current === activeEventId) return
    try {
      const data = await fetchData<unknown, EventMember[]>({
        url: `${API_URL}${API_ROUTES.INVITE_USER}`,
        method: METHODS.GET,
      })
      setEventMembers(Array.isArray(data) ? data : [])
      membersLoadedFor.current = activeEventId
    } catch {
      setEventMembers([])
    }
  }

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
        accessibleEvents,
        activeEventId,
        currentRole,
        setActiveEvent,
        eventMembers,
        fetchEventMembers,
        setEventMembers,
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
