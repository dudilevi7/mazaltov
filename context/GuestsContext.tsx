'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { Guest } from '@/types/Guest'
import { SelectOption } from '@/components/Shared/SelectDropdown'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { useAppContext } from './AppContext'

interface GuestsContextType {
  guests: Guest[]
  setGuests: (guests: Guest[]) => void
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGuest: (id: number, guest: Partial<Omit<Guest, 'id' | 'createdAt'>>) => void
  removeGuest: (id: number) => void
  clearGuests: () => Promise<void>
  deleteGuest: (id: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sideFilter: SelectOption
  setSideFilter: (side: SelectOption) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  setShowNonPhoneNumbersFilter: (show: boolean) => void
  veganFilter: boolean
  setVeganFilter: (v: boolean) => void
  vegetarianFilter: boolean
  setVegetarianFilter: (v: boolean) => void
  glatKosherFilter: boolean
  setGlatKosherFilter: (v: boolean) => void
  transportationFilter: boolean
  setTransportationFilter: (v: boolean) => void
  filteredGuests: Guest[]
  filteredGuestsByQuantityCount: number
  filteredPhoneNumbersCount: number
  showNonPhoneNumbersFilter: boolean
  clearAllFilters: () => void
  hasFiltersOrSearch: boolean
  isLoadingGuests: boolean
}

const GuestsContext = createContext<GuestsContextType | undefined>(undefined)

const GuestsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const { languageDirection, showToast } = useAppContext()
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoadingGuests, setIsLoadingGuests] = useState<boolean>(false)
  const [showNonPhoneNumbersFilter, setShowNonPhoneNumbersFilter] = useState<boolean>(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState<SelectOption>({
    value: 'all',
    label: 'הכל',
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [veganFilter, setVeganFilter] = useState(false)
  const [vegetarianFilter, setVegetarianFilter] = useState(false)
  const [glatKosherFilter, setGlatKosherFilter] = useState(false)
  const [transportationFilter, setTransportationFilter] = useState(false)

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return
    fetchGuests()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const fetchGuests = async () => {
    if (!user?.id) return
    setIsLoadingGuests(true)
    try {
      const data = await fetchData<unknown, Guest[]>({
        url: `${API_URL}${API_ROUTES.GUESTS}`,
        method: METHODS.GET,
      })
      const fetched = Array.isArray(data) ? data : []
      setGuests(fetched)
    } catch {
      setGuests([])
    } finally {
      setIsLoadingGuests(false)
    }
  }

  const addGuest = async (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>, Guest>({
        url: `${API_URL}${API_ROUTES.GUESTS}`,
        method: METHODS.POST,
        body: guest,
      })
      setGuests((prev) => [...prev, created])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'אורח נוסף בהצלחה' : 'Guest added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בהוספת אורח' : 'Failed to add guest',
      })
    }
  }

  const updateGuest = async (id: number, updates: Partial<Omit<Guest, 'id' | 'createdAt'>>) => {
    try {
      const updated = await fetchData<Partial<Guest>, Guest>({
        url: `${API_URL}${API_ROUTES.GUESTS}?id=${id}`,
        method: METHODS.PUT,
        body: updates,
      })
      setGuests((prev) => prev.map((g) => (g.id === id ? updated : g)))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'אורח עודכן בהצלחה' : 'Guest updated successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בעדכון אורח' : 'Failed to update guest',
      })
    }
  }

  const removeGuest = async (id: number) => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.GUESTS}?id=${id}`,
        method: METHODS.DELETE,
      })
      setGuests((prev) => prev.filter((g) => g.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'אורח נמחק בהצלחה' : 'Guest deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת אורח' : 'Failed to delete guest',
      })
    }
  }

  const deleteGuest = removeGuest

  const clearGuests = async () => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.GUESTS_DELETE_ALL}`,
        method: METHODS.DELETE,
      })
      setGuests([])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message:
          languageDirection === LanguageDirection.HEB ? 'כל האורחים נמחקו בהצלחה' : 'All guests deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת האורחים' : 'Failed to delete guests',
      })
    }
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
      const matchNonPhoneNumbers = showNonPhoneNumbersFilter
        ? !guest.phoneNumber || guest.phoneNumber.trim() === ''
        : true
      const matchVegan = !veganFilter || guest.vegan === true
      const matchVegetarian = !vegetarianFilter || guest.vegetarian === true
      const matchGlatKosher = !glatKosherFilter || guest.glatKosher === true
      const matchTransportation = !transportationFilter || guest.transportation === true
      return (
        matchSearch &&
        matchSide &&
        matchStatus &&
        matchCategory &&
        matchNonPhoneNumbers &&
        matchVegan &&
        matchVegetarian &&
        matchGlatKosher &&
        matchTransportation
      )
    })
  }, [
    guests,
    searchQuery,
    sideFilter,
    statusFilter,
    categoryFilter,
    showNonPhoneNumbersFilter,
    veganFilter,
    vegetarianFilter,
    glatKosherFilter,
    transportationFilter,
  ])

  const filteredGuestsByQuantityCount = useMemo(
    () => filteredGuests.reduce((sum, guest) => sum + guest.quantity, 0),
    [filteredGuests]
  )
  const filteredPhoneNumbersCount = useMemo(
    () => filteredGuests.filter((guest) => guest.phoneNumber).length,
    [filteredGuests]
  )

  const hasFiltersOrSearch =
    searchQuery.trim() !== '' ||
    sideFilter.value !== 'all' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    veganFilter ||
    vegetarianFilter ||
    glatKosherFilter ||
    transportationFilter

  const clearAllFilters = () => {
    setSideFilter({ value: 'all', label: 'הכל' })
    setStatusFilter('all')
    setCategoryFilter('all')
    setSearchQuery('')
    setVeganFilter(false)
    setVegetarianFilter(false)
    setGlatKosherFilter(false)
    setTransportationFilter(false)
  }

  return (
    <GuestsContext.Provider
      value={{
        guests,
        setGuests,
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
        filteredPhoneNumbersCount,
        showNonPhoneNumbersFilter,
        setShowNonPhoneNumbersFilter,
        veganFilter,
        setVeganFilter,
        vegetarianFilter,
        setVegetarianFilter,
        glatKosherFilter,
        setGlatKosherFilter,
        transportationFilter,
        setTransportationFilter,
        clearAllFilters,
        hasFiltersOrSearch,
        isLoadingGuests,
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
