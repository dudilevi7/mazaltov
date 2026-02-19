'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Provider } from '@/types/Provider'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { useAppContext } from './AppContext'

interface ProvidersContextType {
  providers: Provider[]
  setProviders: (providers: Provider[]) => void
  addProvider: (provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProvider: (id: number, provider: Partial<Omit<Provider, 'id' | 'createdAt'>>) => void
  removeProvider: (id: number) => void
  isLoadingProviders: boolean
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined)

const ProvidersProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const { languageDirection, showToast } = useAppContext()
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoadingProviders, setIsLoadingProviders] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return
    fetchProviders()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const fetchProviders = async () => {
    if (!user?.id) return
    setIsLoadingProviders(true)
    try {
      const data = await fetchData<unknown, Provider[]>({
        url: `${API_URL}${API_ROUTES.PROVIDERS}`,
        method: METHODS.GET,
      })
      const fetched = Array.isArray(data) ? data : []
      setProviders(fetched)
    } catch {
      setProviders([])
    } finally {
      setIsLoadingProviders(false)
    }
  }

  const addProvider = async (provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>, Provider>({
        url: `${API_URL}${API_ROUTES.PROVIDERS}`,
        method: METHODS.POST,
        body: provider,
      })
      setProviders((prev) => [...prev, created])
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'ספק נוסף בהצלחה' : 'Provider added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בהוספת משימה' : 'Failed to add task',
      })
    } finally {
      setIsLoadingProviders(false)
    }
  }

  const updateProvider = async (id: number, updates: Partial<Omit<Provider, 'id' | 'createdAt'>>) => {
    try {
      const updated = await fetchData<Partial<Provider>, Provider>({
        url: `${API_URL}${API_ROUTES.PROVIDERS}?id=${id}`,
        method: METHODS.PUT,
        body: updates,
      })
      setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'ספק עודכן בהצלחה' : 'Provider updated successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה בעדכון ספק' : 'Failed to update provider',
      })
    }
  }

  const removeProvider = async (id: number) => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.PROVIDERS}?id=${id}`,
        method: METHODS.DELETE,
      })
      setProviders((prev) => prev.filter((p) => p.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: languageDirection === LanguageDirection.HEB ? 'הצלחה' : 'Success',
        message: languageDirection === LanguageDirection.HEB ? 'ספק נמחק בהצלחה' : 'Provider deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: languageDirection === LanguageDirection.HEB ? 'שגיאה' : 'Error',
        message: languageDirection === LanguageDirection.HEB ? 'שגיאה במחיקת ספק' : 'Failed to delete provider',
      })
    }
  }

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        setProviders,
        addProvider,
        updateProvider,
        removeProvider,
        isLoadingProviders,
      }}>
      {children}
    </ProvidersContext.Provider>
  )
}

const useProvidersContext = (): ProvidersContextType => {
  const context = useContext(ProvidersContext)
  if (!context) {
    throw new Error('useProvidersContext must be used within ProvidersProvider')
  }
  return context
}

export { ProvidersProvider, useProvidersContext }
