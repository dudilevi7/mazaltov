'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { Gift } from '@/types/Gift'
import type { GuestNameDuplicateGroup, GiftStats } from '@/components/Gifts/helper'
import { buildGuestNameDuplicateInfo, computeGiftStats } from '@/components/Gifts/helper'
import { SelectOption } from '@/components/Shared/SelectDropdown'
import { useGuestsContext } from './GuestsContext'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { useAppContext } from './AppContext'

interface GiftsContextType {
  gifts: Gift[]
  isLoadingGifts: boolean
  addGift: (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGift: (id: number, gift: Partial<Omit<Gift, 'id' | 'createdAt'>>) => void
  deleteGift: (id: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sideFilter: SelectOption
  setSideFilter: (side: SelectOption) => void
  categoryFilter: string[]
  setCategoryFilter: (categories: string[]) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  filteredGifts: Gift[]
  filteredStats: GiftStats
  totalAmount: number
  amountByType: Record<string, number>
  averageGift: number
  headCount: number
  clearAllFilters: () => void
  hasFiltersOrSearch: boolean
  guestNameDuplicateGroups: GuestNameDuplicateGroup[]
  hasGuestNameDuplicates: boolean
  isGuestNameDuplicate: (gift: Gift) => boolean
}

const GiftsContext = createContext<GiftsContextType | undefined>(undefined)

const GiftsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const { languageDirection, showToast } = useAppContext()
  const { guests } = useGuestsContext()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoadingGifts, setIsLoadingGifts] = useState<boolean>(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState<SelectOption>({ value: 'all', label: 'הכל' })
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return
    fetchGifts()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const fetchGifts = async () => {
    if (!user?.id) return
    setIsLoadingGifts(true)
    try {
      const data = await fetchData<unknown, Gift[]>({
        url: `${API_URL}${API_ROUTES.GIFTS}`,
        method: METHODS.GET,
      })
      setGifts(Array.isArray(data) ? data : [])
    } catch {
      setGifts([])
    } finally {
      setIsLoadingGifts(false)
    }
  }

  const addGift = async (gift: Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>, Gift>({
        url: `${API_URL}${API_ROUTES.GIFTS}`,
        method: METHODS.POST,
        body: gift,
      })
      setGifts((prev) => [...prev, created])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'מתנה נוספה בהצלחה' : 'Gift added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בהוספת מתנה' : 'Failed to add gift',
      })
    }
  }

  const updateGift = async (id: number, updates: Partial<Omit<Gift, 'id' | 'createdAt'>>) => {
    try {
      const updated = await fetchData<Partial<Gift>, Gift>({
        url: `${API_URL}${API_ROUTES.GIFTS}?id=${id}`,
        method: METHODS.PUT,
        body: updates,
      })
      setGifts((prev) => prev.map((g) => (g.id === id ? updated : g)))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'מתנה עודכנה בהצלחה' : 'Gift updated successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בעדכון מתנה' : 'Failed to update gift',
      })
    }
  }

  const deleteGift = async (id: number) => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.GIFTS}?id=${id}`,
        method: METHODS.DELETE,
      })
      setGifts((prev) => prev.filter((g) => g.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'מתנה נמחקה בהצלחה' : 'Gift deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת מתנה' : 'Failed to delete gift',
      })
    }
  }

  const filteredGifts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return gifts.filter((gift) => {
      const matchSearch =
        !q ||
        gift.guestName.toLowerCase().includes(q) ||
        gift.description.toLowerCase().includes(q)
      const matchSide = sideFilter.value === 'all' || gift.guestSide === sideFilter.label
      const matchCategory = categoryFilter.length === 0 || categoryFilter.includes(gift.guestCategory.trim())
      const matchType = typeFilter === 'all' || gift.type === typeFilter
      return matchSearch && matchSide && matchCategory && matchType
    })
  }, [gifts, searchQuery, sideFilter, categoryFilter, typeFilter])

  const filteredStats = useMemo(() => computeGiftStats(filteredGifts, guests), [filteredGifts, guests])
  const { totalAmount, amountByType, averageGift, headCount } = filteredStats

  const hasFiltersOrSearch =
    searchQuery.trim() !== '' || sideFilter.value !== 'all' || categoryFilter.length > 0 || typeFilter !== 'all'

  const { keys: duplicateGuestNameKeys, groups: guestNameDuplicateGroups } = useMemo(
    () => buildGuestNameDuplicateInfo(gifts),
    [gifts]
  )
  const hasGuestNameDuplicates = guestNameDuplicateGroups.length > 0
  const isGuestNameDuplicate = useCallback(
    (gift: Gift) => {
      const raw = (gift.guestName ?? '').trim()
      if (!raw) return false
      return duplicateGuestNameKeys.has(raw.toLowerCase())
    },
    [duplicateGuestNameKeys]
  )

  const clearAllFilters = () => {
    setSideFilter({ value: 'all', label: 'הכל' })
    setCategoryFilter([])
    setTypeFilter('all')
    setSearchQuery('')
  }

  return (
    <GiftsContext.Provider
      value={{
        gifts,
        isLoadingGifts,
        addGift,
        updateGift,
        deleteGift,
        searchQuery,
        setSearchQuery,
        sideFilter,
        setSideFilter,
        categoryFilter,
        setCategoryFilter,
        typeFilter,
        setTypeFilter,
        filteredGifts,
        filteredStats,
        totalAmount,
        amountByType,
        averageGift,
        headCount,
        clearAllFilters,
        hasFiltersOrSearch,
        guestNameDuplicateGroups,
        hasGuestNameDuplicates,
        isGuestNameDuplicate,
      }}>
      {children}
    </GiftsContext.Provider>
  )
}

const useGiftsContext = (): GiftsContextType => {
  const context = useContext(GiftsContext)
  if (!context) {
    throw new Error('useGiftsContext must be used within GiftsProvider')
  }
  return context
}

export { GiftsProvider, useGiftsContext }
