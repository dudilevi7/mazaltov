'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Trip } from '@/types/Trip'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { useAppContext } from './AppContext'

interface TripsContextType {
  trips: Trip[]
  isLoadingTrips: boolean
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTrip: (id: number, updates: Partial<Omit<Trip, 'id' | 'createdAt'>>, options?: { silent?: boolean }) => Promise<void>
  deleteTrip: (id: number) => Promise<void>
}

const TripsContext = createContext<TripsContextType | undefined>(undefined)

const TripsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const { languageDirection, showToast } = useAppContext()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return
    fetchTrips()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const fetchTrips = async () => {
    if (!user?.id) return
    setIsLoadingTrips(true)
    try {
      const data = await fetchData<unknown, Trip[]>({
        url: `${API_URL}${API_ROUTES.TRIPS}`,
        method: METHODS.GET,
      })
      setTrips(Array.isArray(data) ? data : [])
    } catch {
      setTrips([])
    } finally {
      setIsLoadingTrips(false)
    }
  }

  const addTrip = async (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>, Trip>({
        url: `${API_URL}${API_ROUTES.TRIPS}`,
        method: METHODS.POST,
        body: trip,
      })
      setTrips((prev) => [created, ...prev])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'טיול נוסף בהצלחה' : 'Trip added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בהוספת טיול' : 'Failed to add trip',
      })
    }
  }

  const updateTrip = async (
    id: number,
    updates: Partial<Omit<Trip, 'id' | 'createdAt'>>,
    options?: { silent?: boolean }
  ) => {
    try {
      const updated = await fetchData<Partial<Trip>, Trip>({
        url: `${API_URL}${API_ROUTES.TRIPS}?id=${id}`,
        method: METHODS.PUT,
        body: updates,
      })
      setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)))
      if (!options?.silent) {
        showToast({
          type: ToastType.SUCCESS,
          title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
          message: languageDirection === LanguageDirection.HEB ? 'הטיול נשמר' : 'Trip saved',
        })
      }
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בעדכון טיול' : 'Failed to update trip',
      })
    }
  }

  const deleteTrip = async (id: number) => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.TRIPS}?id=${id}`,
        method: METHODS.DELETE,
      })
      setTrips((prev) => prev.filter((t) => t.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'הטיול נמחק' : 'Trip deleted',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת טיול' : 'Failed to delete trip',
      })
    }
  }

  return (
    <TripsContext.Provider value={{ trips, isLoadingTrips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripsContext.Provider>
  )
}

const useTripsContext = (): TripsContextType => {
  const context = useContext(TripsContext)
  if (!context) {
    throw new Error('useTripsContext must be used within TripsProvider')
  }
  return context
}

export { TripsProvider, useTripsContext }
