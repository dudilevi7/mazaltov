'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { Guest } from '@/types/Guest'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { MAZAL_TOV_GUESTS_KEY } from '@/constants/localStorage'
import { SelectOption } from '@/components/Shared/SelectDropdown'

interface GuestsContextType {
  guests: Guest[]
  setGuests: (guests: Guest[]) => void
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGuest: (id: number, guest: Partial<Omit<Guest, 'id' | 'createdAt'>>) => void
  removeGuest: (id: number) => void
  clearGuests: () => void
  deleteGuest: (id: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sideFilter: SelectOption
  setSideFilter: (side: SelectOption) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  filteredGuests: Guest[]
  filteredGuestsByQuantityCount: number
  clearAllFilters: () => void
  hasFiltersOrSearch: boolean
}

const GuestsContext = createContext<GuestsContextType | undefined>(undefined)

const GuestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState<SelectOption>({
    value: 'all',
    label: 'הכל',
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

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

  const filteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return guests.filter((guest) => {
      const matchSearch =
        !q ||
        guest.name.toLowerCase().includes(q) ||
        (guest.category || '').toLowerCase().includes(q) ||
        (guest.phoneNumber || '').includes(q)
      const matchSide = sideFilter.value === 'all' || guest.side === sideFilter.label
      const matchStatus = statusFilter === 'all' || guest.status === statusFilter
      const matchCategory = categoryFilter === 'all' || guest.category === categoryFilter
      return matchSearch && matchSide && matchStatus && matchCategory
    })
  }, [guests, searchQuery, sideFilter, statusFilter, categoryFilter])

  const filteredGuestsByQuantityCount = useMemo(
    () => filteredGuests.reduce((sum, guest) => sum + guest.quantity, 0),
    [filteredGuests]
  )

  const hasFiltersOrSearch =
    searchQuery.trim() !== '' || sideFilter.value !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all'

  const clearAllFilters = () => {
    setSideFilter({ value: 'all', label: 'הכל' })
    setStatusFilter('all')
    setCategoryFilter('all')
    setSearchQuery('')
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
        searchQuery,
        setSearchQuery,
        sideFilter,
        setSideFilter,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        filteredGuests,
        filteredGuestsByQuantityCount,
        clearAllFilters,
        hasFiltersOrSearch,
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
