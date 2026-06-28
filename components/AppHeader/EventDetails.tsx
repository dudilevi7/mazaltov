import { useAppContext } from '@/context/AppContext'
import { getAccessibleEventLabel, getEventDisplayName } from './helper'
import moment from 'moment'
import { getEventTypeDisplayName } from '../Settings/helper'
import { LanguageDirection } from '@/types/General'
import SelectDropdown from '../Shared/SelectDropdown'

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
      className={`absolute bottom-0 ${placementOfDetails} flex flex-col gap-1 bg-linear-to-r from-blue-100 to-blue-300 text-gray-800
         px-3 py-1.5 z-40 animate-fade-in-0.5 shadow-lg shadow-blue-500/20 w-[144px]`}
      dir={languageDirection}>
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
      {hasMultipleEvents && (
        <div className="flex flex-col">
          <label htmlFor="event-switcher" className="sr-only">
            {isRtl ? 'בחר אירוע' : 'Select event'}
          </label>
          <SelectDropdown
            value={activeEventId ?? ''}
            onChange={setActiveEvent}
            buttonClassName="!text-gray-700 !text-xs"
            className="w-full text-xs font-semibold text-white"
            placeholder={isRtl ? 'בחר אירוע' : 'Select event'}
            options={accessibleEvents.map((ev) => ({
              value: ev.eventId,
              label: getAccessibleEventLabel(ev, languageDirection),
            }))}
          />
        </div>
      )}
    </div>
  )
}

export default EventDetails
