'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import useSupabase from '@/hooks/useSupabase'
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'

interface AppLayoutProps {
  children: React.ReactNode
}

const LOGIN_PATH = '/login'

const AppLayout = ({ children }: AppLayoutProps) => {
  const { languageDirection } = useAppContext()
  const { isLoading, isAuthenticated } = useSupabase()
  const isRtl = languageDirection === LanguageDirection.HEB
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && pathname !== LOGIN_PATH) {
      router.push(LOGIN_PATH)
      return
    }
    if (isAuthenticated && pathname === LOGIN_PATH) {
      router.push('/tasks')
      return
    }
    if (pathname === '/') {
      router.push('/tasks')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
      </div>
    )
  }

  if (!isAuthenticated && pathname === LOGIN_PATH) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`flex min-h-screen h-screen bg-gray-50 text-black ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="flex w-full flex-col overflow-hidden font-sans p-6">
          <AppHeader />
          <div className="min-h-0 h-[calc(100vh-150px)] flex-1 overflow-auto">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default AppLayout
