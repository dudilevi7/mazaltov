'use client'

import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import useSupabase from '@/hooks/useSupabase'
import Tooltip, { TooltipPlace } from '../Tooltip'
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
  const tooltipContent = (
    <div className="text-center">
      <div className="font-semibold">{tooltipLabel}</div>
      <div className="text-xs opacity-80">{email}</div>
    </div>
  )

  const picture = user.user_metadata?.picture || ''
  return (
    <Tooltip content={tooltipContent} place={isRtl ? TooltipPlace.LEFT : TooltipPlace.RIGHT} className="cursor-default">
      <div
        className={`w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white
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
