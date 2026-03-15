'use client'

import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import useSupabase from '@/hooks/useSupabase'
import Tooltip from '../Tooltip'
import { getInitials } from './helper'

const UserDetails = () => {
  const { languageDirection } = useAppContext()
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

  const picture = user.user_metadata?.picture || ''
  return (
    <Tooltip htmlContent={tooltipHtml} place={tooltipPlace} className="cursor-default">
      <div
        className={`w-7 h-7 rounded-full bg-linear-to-r from-blue-200 to-blue-300
       flex items-center justify-center text-white text-sm font-bold 
       select-none shrink-0 transition-transform hover:scale-110`}>
        {picture ? (
          <img src={picture} alt={displayName} className="w-full h-full object-cover rounded-full" />
        ) : (
          initials
        )}
      </div>
    </Tooltip>
  )
}

export default UserDetails
