'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { PublicNote } from '@/types/PublicNote'
import useSupabase from '@/hooks/useSupabase'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { useAppContext } from './AppContext'

interface PublicNotesContextType {
  publicNotes: PublicNote[]
  addPublicNote: (note: Omit<PublicNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePublicNote: (id: string, updates: Partial<Omit<PublicNote, 'id' | 'createdAt'>>) => Promise<void>
  removePublicNote: (id: string) => Promise<void>
  isLoadingPublicNotes: boolean
}

const PublicNotesContext = createContext<PublicNotesContextType | undefined>(undefined)

const PublicNotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useSupabase()
  const { languageDirection, showToast } = useAppContext()
  const [publicNotes, setPublicNotes] = useState<PublicNote[]>([])
  const [isLoadingPublicNotes, setIsLoadingPublicNotes] = useState(false)
  const isHeb = languageDirection === LanguageDirection.HEB

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return
    fetchPublicNotes()
  }, [user?.id, isAuthLoading, isAuthenticated])

  const fetchPublicNotes = async () => {
    if (!user?.id) return
    setIsLoadingPublicNotes(true)
    try {
      const data = await fetchData<unknown, PublicNote[]>({
        url: `${API_URL}${API_ROUTES.PUBLIC_NOTES}`,
        method: METHODS.GET,
      })
      setPublicNotes(Array.isArray(data) ? data : [])
    } catch {
      setPublicNotes([])
    } finally {
      setIsLoadingPublicNotes(false)
    }
  }

  const addPublicNote = async (note: Omit<PublicNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await fetchData<Omit<PublicNote, 'id' | 'createdAt' | 'updatedAt'>, PublicNote>({
        url: `${API_URL}${API_ROUTES.PUBLIC_NOTES}`,
        method: METHODS.POST,
        body: note,
      })
      setPublicNotes((prev) => [created, ...prev])
      showToast({
        type: ToastType.SUCCESS,
        title: isHeb ? 'הצלחה' : 'Success',
        message: isHeb ? 'הערה נוספה בהצלחה' : 'Note added successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: isHeb ? 'שגיאה' : 'Error',
        message: isHeb ? 'שגיאה בהוספת הערה' : 'Failed to add note',
      })
    }
  }

  const updatePublicNote = async (id: string, updates: Partial<Omit<PublicNote, 'id' | 'createdAt'>>) => {
    try {
      const updated = await fetchData<Partial<PublicNote>, PublicNote>({
        url: `${API_URL}${API_ROUTES.PUBLIC_NOTES}/${id}`,
        method: METHODS.PUT,
        body: updates,
      })
      setPublicNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
      showToast({
        type: ToastType.SUCCESS,
        title: isHeb ? 'הצלחה' : 'Success',
        message: isHeb ? 'הערה עודכנה בהצלחה' : 'Note updated successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: isHeb ? 'שגיאה' : 'Error',
        message: isHeb ? 'שגיאה בעדכון הערה' : 'Failed to update note',
      })
    }
  }

  const removePublicNote = async (id: string) => {
    try {
      await fetchData<unknown, unknown>({
        url: `${API_URL}${API_ROUTES.PUBLIC_NOTES}?id=${id}`,
        method: METHODS.DELETE,
      })
      setPublicNotes((prev) => prev.filter((n) => n.id !== id))
      showToast({
        type: ToastType.SUCCESS,
        title: isHeb ? 'הצלחה' : 'Success',
        message: isHeb ? 'הערה נמחקה בהצלחה' : 'Note deleted successfully',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: isHeb ? 'שגיאה' : 'Error',
        message: isHeb ? 'שגיאה במחיקת הערה' : 'Failed to delete note',
      })
    }
  }

  return (
    <PublicNotesContext.Provider
      value={{
        publicNotes,
        addPublicNote,
        updatePublicNote,
        removePublicNote,
        isLoadingPublicNotes,
      }}>
      {children}
    </PublicNotesContext.Provider>
  )
}

const usePublicNotesContext = (): PublicNotesContextType => {
  const context = useContext(PublicNotesContext)
  if (!context) {
    throw new Error('usePublicNotesContext must be used within PublicNotesProvider')
  }
  return context
}

export { PublicNotesProvider, usePublicNotesContext }
