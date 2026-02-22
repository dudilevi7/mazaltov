'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ShoppingItem } from '@/types/ShoppingItem'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { useAppContext } from './AppContext'

interface ShoppingContextType {
  items: ShoppingItem[]
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (id: number, updates: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>>) => void
  removeItem: (id: number) => void
  togglePurchased: (item: ShoppingItem) => void
  isLoadingItems: boolean
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined)

const ShoppingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const { languageDirection, showToast } = useAppContext()
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return
    fetchItems()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const fetchItems = async () => {
    if (!user?.id) return
    setIsLoadingItems(true)
    try {
      const data = await fetchData<unknown, ShoppingItem[]>({
        url: `${API_URL}${API_ROUTES.SHOPPING}`,
        method: METHODS.GET,
      })
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setIsLoadingItems(false)
    }
  }

  const addItem = async (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>, ShoppingItem>({
        url: `${API_URL}${API_ROUTES.SHOPPING}`,
        method: METHODS.POST,
        body: item,
      })
      setItems((prev) => [created, ...prev])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'פריט נוסף בהצלחה' : 'Item added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בהוספת פריט' : 'Failed to add item',
      })
    }
  }

  const updateItem = async (id: number, updates: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>>) => {
    const existing = items.find((i) => i.id === id)
    if (!existing) return
    const payload: ShoppingItem = { ...existing, ...updates, updatedAt: Date.now() }
    try {
      const updated = await fetchData<ShoppingItem, ShoppingItem>({
        url: `${API_URL}${API_ROUTES.SHOPPING}`,
        method: METHODS.PUT,
        body: payload,
      })
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'פריט עודכן בהצלחה' : 'Item updated successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בעדכון פריט' : 'Failed to update item',
      })
    }
  }

  const removeItem = async (id: number) => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.SHOPPING}?id=${id}`,
        method: METHODS.DELETE,
      })
      setItems((prev) => prev.filter((i) => i.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'פריט נמחק בהצלחה' : 'Item deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת פריט' : 'Failed to delete item',
      })
    }
  }

  const togglePurchased = (item: ShoppingItem) => {
    updateItem(item.id, { isPurchased: !item.isPurchased })
  }

  return (
    <ShoppingContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        togglePurchased,
        isLoadingItems,
      }}>
      {children}
    </ShoppingContext.Provider>
  )
}

const useShoppingContext = (): ShoppingContextType => {
  const context = useContext(ShoppingContext)
  if (!context) {
    throw new Error('useShoppingContext must be used within ShoppingProvider')
  }
  return context
}

export { ShoppingProvider, useShoppingContext }
