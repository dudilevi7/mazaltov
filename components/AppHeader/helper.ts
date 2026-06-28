import { EventSettings, EventType } from '@/types/Settings'
import { LanguageDirection } from '@/types/General'
import type { AccessibleEvent } from '@/types/eventMember'
import { getEventTypeDisplayName } from '../Settings/helper'

export const getAccessibleEventLabel = (ev: AccessibleEvent, languageDirection: LanguageDirection): string => {
  const isRtl = languageDirection === LanguageDirection.HEB
  const names = [ev.brideName?.trim(), ev.groomName?.trim()].filter(Boolean).join(' & ')
  const base = ev.eventType
    ? getEventTypeDisplayName(ev.eventType as EventType, languageDirection, ev.customEventType as string)
    : names
  return ev.isOwner ? `${base} ${isRtl ? '(שלי)' : '(mine)'}` : base
}

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
