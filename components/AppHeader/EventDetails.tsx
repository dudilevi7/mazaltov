import { useAppContext } from '@/context/AppContext'
import { getEventDisplayName } from './helper'
import moment from 'moment'
import { getEventTypeDisplayName } from '../Settings/helper'
import { LanguageDirection } from '@/types/General'

const EventDetails = () => {
  const { eventSettings, languageDirection, isSidebarOpen } = useAppContext()
  const eventTypeDisplayName = getEventTypeDisplayName(eventSettings.eventType, languageDirection)
  const eventDisplayName = getEventDisplayName(eventSettings)
  const placementOfDetails = languageDirection === LanguageDirection.HEB ? 'right-0' : 'left-0'
  if (!isSidebarOpen || !eventDisplayName) return null
  return (
    <div
      className={`absolute bottom-8 ${placementOfDetails} flex flex-col bg-linear-to-r from-blue-200 to-blue-300
         text-gray-700 px-3 py-1.5 rounded-e-md z-50 animate-fade-in-0.5 shadow-lg shadow-blue-500/20`}
      dir={languageDirection}>
      <div className="flex flex-row gap-0.5 font-bold">
        <span className="text-sm rounded-md">{eventTypeDisplayName || ''}</span>
        <span className="text-sm rounded-md">{eventTypeDisplayName ? '-' : ''}</span>
        <span className="text-sm rounded-md">{getEventDisplayName(eventSettings) || ''}</span>
      </div>
      {eventSettings.eventHall && <span className="text-xs rounded-md">{eventSettings.eventHall}</span>}
      {eventSettings.eventDate && (
        <span className="text-xs rounded-md">{moment(eventSettings.eventDate).format('DD/MM/YYYY')}</span>
      )}
    </div>
  )
}

export default EventDetails
