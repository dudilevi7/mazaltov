'use client'

import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import InviteUser from '@/components/Settings/ShareEvent/InviteUser'

const InviteUserPage = () => {
  const router = useRouter()
  const { languageDirection } = useAppContext()

  return (
    <div className="flex w-full flex-col font-sans" dir={languageDirection === LanguageDirection.HEB ? 'rtl' : 'ltr'}>
      <InviteUser onClose={() => router.push('/settings')} />
    </div>
  )
}

export default InviteUserPage
