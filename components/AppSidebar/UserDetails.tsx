'use client'

import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import useSupabase from '@/hooks/useSupabase'
import Tooltip, { TooltipPlace } from '../Tooltip'
import { getInitials } from './helper'
import { useState } from 'react'

const UserDetails = () => {
  const { languageDirection } = useAppContext()
  const { user } = useSupabase()
  const isRtl = languageDirection === LanguageDirection.HEB
  const [pictureFailed, setPictureFailed] = useState(false)

  if (!user) return null

  const email = user.email || ''
  const displayName =
    user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || ''
  const initials = getInitials(displayName, email)
  const picture = !pictureFailed ? user.user_metadata?.picture || null : null
  const tooltipLabel = displayName || email.split('@')[0]
  const tooltipContent = (
    <div className="text-center">
      <div className="font-semibold">{tooltipLabel}</div>
      <div className="text-xs opacity-80">{email}</div>
    </div>
  )

  const initialsOrPicture = picture ? (
    <img
      src={picture}
      alt={displayName}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setPictureFailed(true)}
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    initials
  )

  return (
    <Tooltip content={tooltipContent} place={isRtl ? TooltipPlace.LEFT : TooltipPlace.RIGHT} className="cursor-default">
      <div
        className={`w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white
       flex items-center justify-center text-white text-sm font-bold 
       select-none shrink-0 transition-transform hover:scale-110 ${picture ? 'bg-cover bg-center' : ''}`}>
        {initialsOrPicture}
      </div>
    </Tooltip>
  )
}

export default UserDetails
