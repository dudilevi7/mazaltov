'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRing } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { EventType } from '@/types/Settings'
import { getEventDisplayName } from './helper'
import PageName from '@/components/PageName'

const AppHeader = () => {
  const { eventSettings, languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB

  const eventDisplayName = getEventDisplayName(eventSettings)

  const getEventTypeLabel = () => {
    const { eventType, customEventType } = eventSettings
    const isHebrew = languageDirection === LanguageDirection.HEB

    if (eventType === EventType.WEDDING) {
      return isHebrew ? 'חתונה' : 'Wedding'
    }
    if (eventType === EventType.BAR_MITZVA) {
      return isHebrew ? 'בר מצווה' : 'Bar Mitzva'
    }
    if (eventType === EventType.BRIT) {
      return isHebrew ? 'ברית' : 'Brit'
    }
    if (eventType === EventType.CUSTOM && customEventType?.trim()) {
      return customEventType.trim()
    }
    return ''
  }

  const eventTypeLabel = getEventTypeLabel()

  let eventLine = ''
  if (eventTypeLabel || eventDisplayName) {
    if (eventSettings.eventType === EventType.WEDDING && eventDisplayName) {
      eventLine = `${eventTypeLabel} - ${eventDisplayName}`
    } else if (eventTypeLabel && eventDisplayName) {
      eventLine = `${eventTypeLabel} (${eventDisplayName})`
    } else {
      eventLine = eventTypeLabel || eventDisplayName
    }
  }

  return (
    <div className={`flex flex-row items-start justify-between`} dir={languageDirection}>
      <PageName />
      <div className="flex flex-col">
        <div className="flex flex-row gap-1 items-center animate-fade-in-0.5">
          <FontAwesomeIcon icon={faRing} className="text-gray-300 animate-pulse max-w-8" size="2x" />
          <span className="text-2xl font-bold text-gray-800 rounded-md">MazalTov</span>
        </div>
        {eventLine && <p className="text-sm text-gray-600 animate-fade-in-0.5">{eventLine}</p>}
      </div>
    </div>
  )
}

export default AppHeader
