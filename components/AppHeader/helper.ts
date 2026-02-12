import { EventSettings, EventType } from '@/types/Settings'

export const getEventDisplayName = (settings: EventSettings): string => {
  if (settings.eventType === EventType.WEDDING) {
    const bride = settings.brideName?.trim() || ''
    const groom = settings.groomName?.trim() || ''
    if (bride || groom) return [bride, groom].filter(Boolean).join(' & ')
  }
  if (settings.ownerName?.trim()) return settings.ownerName.trim()
  if (settings.eventType === EventType.CUSTOM && settings.customEventType?.trim()) {
    return settings.customEventType.trim()
  }
  return ''
}
