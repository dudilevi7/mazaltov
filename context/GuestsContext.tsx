'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Guest } from '@/types/Guest'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { MAZAL_TOV_GUESTS_KEY } from '@/constants/localStorage'

interface GuestsContextType {
  guests: Guest[]
  setGuests: (guests: Guest[]) => void
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGuest: (id: number, guest: Partial<Omit<Guest, 'id' | 'createdAt'>>) => void
  removeGuest: (id: number) => void
  clearGuests: () => void
  deleteGuest: (id: number) => void
}

const GuestsContext = createContext<GuestsContextType | undefined>(undefined)

const GuestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [guests, setGuests] = useState<Guest[]>([])

  useEffect(() => {
    setGuests(getFromLocalStorage(MAZAL_TOV_GUESTS_KEY, []))
  }, [])

  const persistGuests = (nextGuests: Guest[]) => {
    setGuests(nextGuests)
    setToLocalStorage(MAZAL_TOV_GUESTS_KEY, nextGuests)
  }

  const addGuest = (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newGuest: Guest = {
      ...guest,
      id: now,
      createdAt: now,
      updatedAt: now,
    }
    persistGuests([...guests, newGuest])
  }

  const deleteGuest = (id: number) => {
    const nextGuests = guests.filter((g) => g.id !== id)
    persistGuests(nextGuests)
  }

  const updateGuest = (id: number, updates: Partial<Omit<Guest, 'id' | 'createdAt'>>) => {
    const now = Date.now()
    const nextGuests = guests.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: now } : g))
    persistGuests(nextGuests)
  }

  const removeGuest = (id: number) => {
    const nextGuests = guests.filter((g) => g.id !== id)
    persistGuests(nextGuests)
  }

  const clearGuests = () => {
    persistGuests([])
  }

  return (
    <GuestsContext.Provider
      value={{
        guests,
        setGuests: persistGuests,
        addGuest,
        updateGuest,
        removeGuest,
        clearGuests,
        deleteGuest,
      }}>
      {children}
    </GuestsContext.Provider>
  )
}

const useGuestsContext = (): GuestsContextType => {
  const context = useContext(GuestsContext)
  if (!context) {
    throw new Error('useGuestsContext must be used within GuestsProvider')
  }
  return context
}

export { GuestsProvider, useGuestsContext }
