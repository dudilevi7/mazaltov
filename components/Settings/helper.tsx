import { LanguageDirection } from '@/types/General'
import { EventType } from '@/types/Settings'
import { SelectOption } from '../Shared/SelectDropdown'

const EVENT_TYPE_DISPLAY_NAME_HEB: Record<EventType, string> = {
  [EventType.WEDDING]: 'חתונה',
  [EventType.BAR_MITZVA]: 'בר מצווה',
  [EventType.BRIT]: 'ברית',
  [EventType.CUSTOM]: '',
}
const EVENT_TYPE_DISPLAY_NAME_ENG: Record<EventType, string> = {
  [EventType.WEDDING]: 'Wedding',
  [EventType.BAR_MITZVA]: 'Bar Mitzva',
  [EventType.BRIT]: 'Brit',
  [EventType.CUSTOM]: '',
}

export const getEventTypeDisplayName = (eventType: EventType, languageDirection: LanguageDirection): string => {
  const eventTypeDisplayName =
    languageDirection === LanguageDirection.HEB ? EVENT_TYPE_DISPLAY_NAME_HEB : EVENT_TYPE_DISPLAY_NAME_ENG
  if (eventTypeDisplayName[eventType]) {
    return eventTypeDisplayName[eventType]
  }
  return eventType.toString().replace('_', ' ')
}

export const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: EventType.WEDDING, label: 'חתונה' },
  { value: EventType.BAR_MITZVA, label: 'בר מצווה' },
  { value: EventType.BRIT, label: 'ברית' },
]

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: LanguageDirection.HEB, label: 'עברית' },
  { value: LanguageDirection.ENG, label: 'English' },
]
