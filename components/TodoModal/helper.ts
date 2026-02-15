import { EventSettings, EventType } from '@/types/Settings'
import type { SelectOption } from '@/components/Shared/SelectDropdown'

export const getEventOwnerOptions = (eventSettings: EventSettings): SelectOption[] => {
  const options: SelectOption[] = []
  if (eventSettings.eventType === EventType.WEDDING) {
    const brideLabel = eventSettings.brideName?.trim() || 'כלה'
    const groomLabel = eventSettings.groomName?.trim() || 'חתן'
    options.push({ value: brideLabel, label: brideLabel }, { value: groomLabel, label: groomLabel })
  } else {
    const ownerLabel = eventSettings.ownerName?.trim() || 'מארגן'
    options.push({ value: ownerLabel, label: ownerLabel })
  }
  return options
}
