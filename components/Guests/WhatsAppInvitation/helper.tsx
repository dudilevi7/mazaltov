import { EventSettings, EventType } from '@/types/Settings'
import moment from 'moment'

export const getDefaultEventManualMessage = (eventSettings: EventSettings, isRTL?: boolean): string => {
  const { eventType, eventDate, eventHall, ownerName, brideName, groomName, customEventType } = eventSettings
  let prefix = isRTL ? 'נשמח לראותך באירוע ה' : 'We are looking forward to seeing you at the event'
  switch (eventType) {
    case EventType.WEDDING:
      prefix += isRTL ? 'חתונה' : 'wedding'
      return [prefix, moment(eventDate).format('DD/MM/YYYY'), eventHall, `${brideName} ו${groomName}`].join('\n')
    case EventType.BAR_MITZVA:
      prefix += isRTL ? 'בר המצווה' : 'bar mitzvah'
      return [prefix, moment(eventDate).format('DD/MM/YYYY'), eventHall, ownerName].join('\n')
    case EventType.CUSTOM:
      prefix += `${customEventType} `
      return [prefix, moment(eventDate).format('DD/MM/YYYY'), eventHall, ownerName].join('\n')
    default:
      return [prefix, moment(eventDate).format('DD/MM/YYYY'), eventHall].join('\n')
  }
}
