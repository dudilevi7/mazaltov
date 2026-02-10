import type { Guest } from '@/types/Guest'
import { GuestStatus, GuestSide } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'

const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/

const validatePhoneNumber = (phone?: string): boolean => {
  if (!phone) return false
  const cleaned = phone.replace(/\D/g, '').replaceAll('-', '').replaceAll(' ', '').replaceAll('+972', '0')
  return PHONE_NUMBER_REGEX.test(cleaned)
}

// const NAME_REGEX_INC_HEBREW = /^[\u0590-\u05FF\s]{2,}(?:\s[\u0590-\u05FF\s]{2,})+$|^[A-Za-z\s]{2,}(?:\s[A-Za-z\s]{2,})+$/
const ONLY_LETTERS_HEBREW_SPACE_AND_BRACKETS = /^[A-Za-z\u0590-\u05FF\s\(\)\[\]]+$/

const validateRealName = (name: string): boolean => {
  const trimmed = name.trim()
  if (trimmed.length < 2) return false
  return ONLY_LETTERS_HEBREW_SPACE_AND_BRACKETS.test(trimmed)
}

const isNameInGuests = (name: string, guests: Guest[], excludeId?: number): boolean => {
  const normalized = name.trim().toLowerCase()
  return guests.some((g) => g.id !== excludeId && g.name?.trim().toLowerCase() === normalized)
}

const SIDE_OPTIONS: SelectOption[] = [
  { value: GuestSide.BRIDE, label: 'כלה' },
  { value: GuestSide.GROOM, label: 'חתן' },
  { value: GuestSide.BOTH, label: 'שניהם' },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: GuestStatus.PENDING, label: 'ממתין' },
  { value: GuestStatus.ACCEPTED, label: 'אישר' },
  { value: GuestStatus.DECLINED, label: 'דחה' },
]

const SIDE_LABELS: Record<GuestSide, string> = {
  [GuestSide.BRIDE]: 'כלה',
  [GuestSide.GROOM]: 'חתן',
  [GuestSide.BOTH]: 'שניהם',
}

const STATUS_LABELS: Record<GuestStatus, string> = {
  [GuestStatus.PENDING]: 'ממתין',
  [GuestStatus.ACCEPTED]: 'אישר',
  [GuestStatus.DECLINED]: 'דחה',
}

const exportGuestsToCsv = (guests: Guest[], columns: { key: keyof Guest; label: string }[]): string => {
  const header = columns.map((c) => c.label).join(',')
  const rows = guests.map((g) =>
    columns
      .map((c) => {
        const val = g[c.key]
        if (val === undefined || val === null) return ''
        const str = String(val)
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
      })
      .join(',')
  )
  return [header, ...rows].join('\n')
}

export {
  validatePhoneNumber,
  validateRealName,
  isNameInGuests,
  SIDE_OPTIONS,
  STATUS_OPTIONS,
  SIDE_LABELS,
  STATUS_LABELS,
  exportGuestsToCsv,
}
