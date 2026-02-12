'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      router.push('/tasks')
    }
  }, [pathname, router])

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
