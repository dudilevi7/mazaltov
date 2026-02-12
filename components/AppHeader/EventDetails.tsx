import { useAppContext } from '@/context/AppContext'
import { getEventDisplayName } from './helper'
import moment from 'moment'
import { EventType } from '@/types/Settings'
import { getEventTypeDisplayName } from '../Settings/helper'
import { useState } from 'react'
import { LanguageDirection } from '@/types/General'

const EventDetails = () => {
  const { eventSettings, languageDirection, isSidebarOpen } = useAppContext()
  const eventTypeDisplayName = getEventTypeDisplayName(eventSettings.eventType, languageDirection)
  const placementOfDetails = languageDirection === LanguageDirection.HEB ? 'right-5' : 'left-5'
  if (!isSidebarOpen) return null
  return (
    <div
      className={`absolute bottom-8 ${placementOfDetails} flex flex-col bg-gray-100 border border-gray-200 px-1 py-0.5 rounded-md z-50 animate-fade-in-0.5`}
      dir={languageDirection}>
      <div className="flex flex-row gap-0.5">
        <span className="text-sm text-gray-500 rounded-md">{eventTypeDisplayName}</span>
        <span className="text-sm text-gray-500 rounded-md">-</span>
        <span className="text-sm text-gray-500 rounded-md">{getEventDisplayName(eventSettings)}</span>
      </div>
      <span className="text-xs text-gray-500 rounded-md">{eventSettings.eventHall}</span>
      <span className="text-xs text-gray-500 rounded-md">{moment(eventSettings.eventDate).format('DD/MM/YYYY')}</span>
    </div>
  )
}

export default EventDetails
