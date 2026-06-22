import { useAppContext } from '@/context/AppContext'
import { getAccessibleEventLabel, getEventDisplayName } from './helper'
import moment from 'moment'
import { getEventTypeDisplayName } from '../Settings/helper'
import { LanguageDirection } from '@/types/General'

const EventDetails = () => {
  const { eventSettings, languageDirection, isSidebarOpen, accessibleEvents, activeEventId, setActiveEvent } =
    useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const hasMultipleEvents = accessibleEvents.length > 1
  const eventTypeDisplayName = getEventTypeDisplayName(
    eventSettings.eventType,
    languageDirection,
    eventSettings.customEventType
  )
  const eventDisplayName = getEventDisplayName(eventSettings)
  const placementOfDetails = languageDirection === LanguageDirection.HEB ? 'right-0' : 'left-0'

  if (!isSidebarOpen) return null
  if (!eventDisplayName && !hasMultipleEvents) return null

  return (
    <div
      className={`absolute bottom-8 ${placementOfDetails} flex flex-col gap-1 bg-linear-to-r from-blue-500 to-blue-600 text-white
         px-3 py-1.5 rounded-e-md z-40 animate-fade-in-0.5 shadow-lg shadow-blue-500/20 max-w-[170px]`}
      dir={languageDirection}>
      {hasMultipleEvents && (
        <div className="flex flex-col">
          <label htmlFor="event-switcher" className="sr-only">
            {isRtl ? 'בחר אירוע' : 'Select event'}
          </label>
          <select
            id="event-switcher"
            value={activeEventId ?? ''}
            onChange={(e) => setActiveEvent(e.target.value)}
            className="w-full cursor-pointer rounded-md border border-white/30 bg-blue-700/40 px-1.5 py-1 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            {accessibleEvents.map((ev) => (
              <option key={ev.eventId} value={ev.eventId} className="text-gray-800">
                {getAccessibleEventLabel(ev, languageDirection)}
              </option>
            ))}
          </select>
        </div>
      )}

      {eventDisplayName && (
        <>
          <div className="flex flex-row gap-0.5 font-bold">
            <span className="text-sm rounded-md">{eventTypeDisplayName || ''}</span>
            <span className="text-sm rounded-md">{eventTypeDisplayName ? '-' : ''}</span>
            <span className="text-sm rounded-md">{eventDisplayName}</span>
          </div>
          {eventSettings.eventHall && <span className="text-xs rounded-md">{eventSettings.eventHall}</span>}
          {eventSettings.eventDate && (
            <span className="text-xs rounded-md">{moment(eventSettings.eventDate).format('DD/MM/YYYY')}</span>
          )}
        </>
      )}
    </div>
  )
}

export default EventDetails
