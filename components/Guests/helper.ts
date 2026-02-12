import type { Guest } from '@/types/Guest'
import { GuestStatus, GuestSide } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import type { EventSettings } from '@/types/Settings'
import { EventType } from '@/types/Settings'
import * as XLSX from 'xlsx'

const isWedding = (s: EventSettings) => s.eventType === EventType.WEDDING

export const getSideOptions = (eventSettings: EventSettings): SelectOption[] => {
  if (isWedding(eventSettings)) {
    return [
      { value: GuestSide.BRIDE, label: eventSettings.brideName?.trim() || 'כלה' },
      { value: GuestSide.GROOM, label: eventSettings.groomName?.trim() || 'חתן' },
    ]
  }
  return [{ value: GuestSide.OWNER, label: eventSettings.ownerName?.trim() || 'מארגן' }]
}

export const getSideLabels = (eventSettings: EventSettings): Record<string, string> => {
  if (isWedding(eventSettings)) {
    return {
      [GuestSide.BRIDE]: eventSettings.brideName?.trim() || 'כלה',
      [GuestSide.GROOM]: eventSettings.groomName?.trim() || 'חתן',
      [GuestSide.BOTH]: 'שניהם',
    }
  }
  return { [GuestSide.OWNER]: eventSettings.ownerName?.trim() || 'מארגן' }
}

export const getWhatsAppUrl = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? '972' + digits.slice(1) : digits
  return `https://wa.me/${normalized}`
}

const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/

const validatePhoneNumber = (phone?: string): boolean => {
  if (!phone) return false
  const cleaned = phone.replace(/\D/g, '').replaceAll('-', '').replaceAll(' ', '').replaceAll('+972', '0')
  return PHONE_NUMBER_REGEX.test(cleaned)
}

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

const STATUS_OPTIONS: SelectOption[] = [
  { value: GuestStatus.PENDING, label: 'ממתין' },
  { value: GuestStatus.ACCEPTED, label: 'אישר' },
  { value: GuestStatus.DECLINED, label: 'דחה' },
]

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

const importGuestsFromExcel = async (): Promise<Guest[]> => {
  const [file] = await (window as any).showOpenFilePicker()
  const fileHandle = await file.getFile()
  const text = await fileHandle.text()
  const data = new Uint8Array(await fileHandle.arrayBuffer())
  const xls = XLSX.read(data, { type: 'array' })
  const sheet = xls.Sheets[xls.SheetNames[0]]
  const guests = XLSX.utils.sheet_to_json(sheet)

  return guests.map((guest: any, index: number) => ({
    name: guest['שם'],
    phoneNumber: guest['טלפון'],
    quantity: guest['כמות מוזמנים'],
    side: guest['צד'],
    category: guest['קבוצה'],
    gift: guest['מתנה'],
    status: GuestStatus.PENDING,
    manualApproval: false,
    id: index + 1,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }))
}

export {
  validatePhoneNumber,
  validateRealName,
  isNameInGuests,
  STATUS_OPTIONS,
  STATUS_LABELS,
  exportGuestsToCsv,
  importGuestsFromExcel,
}
