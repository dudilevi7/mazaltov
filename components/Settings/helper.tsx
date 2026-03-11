import { LanguageDirection } from '@/types/General'
import { EventSettings, EventType } from '@/types/Settings'
import { SelectOption } from '../Shared/SelectDropdown'

export interface EventOwnerPhone {
  label: string
  phone: string
}

export const getEventOwnerPhones = (s: EventSettings): EventOwnerPhone[] => {
  const out: EventOwnerPhone[] = []
  if (s.eventType === EventType.WEDDING) {
    if (s.bridePhone?.trim()) out.push({ label: s.brideName?.trim() || 'כלה', phone: s.bridePhone.trim() })
    if (s.groomPhone?.trim()) out.push({ label: s.groomName?.trim() || 'חתן', phone: s.groomPhone.trim() })
  } else {
    if (s.ownerPhone?.trim()) out.push({ label: s.ownerName?.trim() || 'מארגן', phone: s.ownerPhone.trim() })
  }
  return out
}

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

export const getEventTypeDisplayName = (
  eventType: EventType,
  languageDirection: LanguageDirection,
  customEventType?: string
): string => {
  const eventTypeDisplayName =
    languageDirection === LanguageDirection.HEB ? EVENT_TYPE_DISPLAY_NAME_HEB : EVENT_TYPE_DISPLAY_NAME_ENG
  if (eventTypeDisplayName[eventType]) {
    return eventTypeDisplayName[eventType]
  }
  if (eventType === EventType.CUSTOM) {
    return customEventType ?? ''
  }
  return ''
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

const EVENT_SETTINGS_KEYS: (keyof EventSettings)[] = [
  'eventId',
  'eventType',
  'customEventType',
  'ownerName',
  'brideName',
  'groomName',
  'bridePhone',
  'groomPhone',
  'ownerPhone',
  'eventHall',
  'eventDate',
]

export const eventSettingsEquals = (current: EventSettings, lastSnapshot: EventSettings): boolean => {
  return EVENT_SETTINGS_KEYS.every((k) => (current[k] ?? '') === (lastSnapshot[k] ?? ''))
}

export const hasEventData = (s: EventSettings): boolean => {
  return !!(
    (s.brideName ?? '').trim() ||
    (s.groomName ?? '').trim() ||
    (s.ownerName ?? '').trim() ||
    (s.customEventType ?? '').trim() ||
    (s.eventHall ?? '').trim() ||
    (s.eventDate ?? '').trim()
  )
}
