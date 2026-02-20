'use client'

import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import useSupabase from '@/hooks/useSupabase'
import Tooltip from '../Tooltip'

const getInitials = (displayName: string, email: string): string => {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].substring(0, 2).toUpperCase()
  }
  return email.substring(0, 2).toUpperCase()
}

const UserDetails = () => {
  const { languageDirection, isSidebarOpen } = useAppContext()
  const { user } = useSupabase()
  const isRtl = languageDirection === LanguageDirection.HEB

  if (!user) return null

  const email = user.email || ''
  const displayName =
    user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || ''
  const initials = getInitials(displayName, email)
  const tooltipLabel = displayName || email.split('@')[0]
  const tooltipHtml = `<div class="text-center"><div class="font-semibold">${tooltipLabel}</div><div class="text-xs opacity-80">${email}</div></div>`
  const tooltipPlace = isRtl ? 'left' : 'right'

  return (
    <Tooltip htmlContent={tooltipHtml} place={tooltipPlace} className="cursor-default">
      <div
        className={`w-7 h-7 rounded-full bg-linear-to-r from-blue-200 to-blue-300
       flex items-center justify-center text-white text-sm font-bold 
       select-none shrink-0 transition-transform hover:scale-110`}>
        {initials}
      </div>
    </Tooltip>
  )
}

export default UserDetails
