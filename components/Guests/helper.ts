import type { Guest } from '@/types/Guest'
import { GuestStatus, GuestSide } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import type { EventSettings } from '@/types/Settings'
import { EventType } from '@/types/Settings'
import * as XLSX from 'xlsx'
import moment from 'moment'

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

export const getWhatsAppUrl = (phone: string, message?: string): string => {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('0') ? '972' + digits.slice(1) : digits
  const base = `https://wa.me/${normalized}`
  if (message?.trim()) return `${base}?text=${encodeURIComponent(message.trim())}`
  return base
}

const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/

const validatePhoneNumber = (phone?: string): boolean => {
  if (!phone) return true
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

const exportGuestsToExcel = (
  guests: Guest[],
  columns: { key: keyof Guest; label: string }[],
  sideLabels?: Record<string, string>
): void => {
  const rows = guests.map((g) => {
    const obj: Record<string, string | number | boolean | undefined> = {}
    columns.forEach((c) => {
      let val = g[c.key]
      if (c.key === 'side' && sideLabels && typeof val === 'string') {
        val = sideLabels[val] ?? val
      }
      obj[c.label] = val === undefined || val === null ? '' : val
    })
    return obj
  })
  const sheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'אורחים')
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `guests-${moment().format('DD-MM-YYYY')}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

const exportGuestsCustomExcel = (
  guests: Guest[],
  fieldMap: { key: keyof Guest; customLabel: string }[],
  sideLabels?: Record<string, string>
): void => {
  const rows = guests.map((g) => {
    const obj: Record<string, string | number | boolean | undefined> = {}
    fieldMap.forEach((f) => {
      let val = g[f.key]
      if (f.key === 'side' && sideLabels && typeof val === 'string') {
        val = sideLabels[val] ?? val
      }
      obj[f.customLabel] = val === undefined || val === null ? '' : val
    })
    return obj
  })
  const sheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'אורחים')
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `guests-custom-${moment().format('DD-MM-YYYY')}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

const importGuestsFromExcel = async (): Promise<Guest[]> => {
  const [file] = await (window as any).showOpenFilePicker()
  const fileHandle = await file.getFile()
  const data = new Uint8Array(await fileHandle.arrayBuffer())
  const xls = XLSX.read(data, { type: 'array' })
  const sheet = xls.Sheets[xls.SheetNames[0]]
  const guests = XLSX.utils.sheet_to_json(sheet)
  return guests.map((guest: any, index: number) => ({
    name: guest['שם'],
    phoneNumber: guest['טלפון'],
    quantity: guest['כמות מוזמנים'] || guest['כמות'],
    side: guest['צד'],
    category: guest['קבוצה'] || guest['קירבה'],
    gift: guest['מתנה'],
    status: guest['סטטוס'] || GuestStatus.PENDING,
    manualApproval: guest['אישור ידני'] || false,
    id: index + 1,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  }))
}
const iplanColumnsNamesMapToGuest: Record<string, Partial<keyof Guest>> = {
  שיוך: 'side',
  __EMPTY: 'name',
  __EMPTY_1: 'quantity',
  __EMPTY_2: 'category',
  __EMPTY_3: 'phoneNumber',
}

const iplanHeaderRow: Record<string, string> = {
  __EMPTY: 'הזמנה לכבוד',
  __EMPTY_1: "מס' אורחים שהוזמנו",
  שיוך: 'צד',
  __EMPTY_2: 'קבוצה',
  'פרטי התקשרות': 'סלולרי',
  __EMPTY_3: 'טלפון רגיל',
  __EMPTY_4: 'אימייל',
  כתובת: 'עיר',
  __EMPTY_5: 'רחוב',
  __EMPTY_6: 'מיקוד',
  __EMPTY_7: 'תא דואר',
  __EMPTY_8: "צ'ק צפוי",
}

const exportToIplanTemplate = async (
  guests: Guest[],
  sideNamesMap: Record<string, string>,
  eventSettings: EventSettings
): Promise<void> => {
  const res = await fetch('/iplan_template.xlsx')
  const arrayBuffer = await res.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet)
  if (Array.isArray(rows) && rows.length === 0) {
    return
  }
  const newRows = guests.map((guest: Guest) => {
    const obj: Record<string, string | number | boolean | undefined> = {}
    Object.keys(iplanColumnsNamesMapToGuest).forEach((key) => {
      const guestKey = iplanColumnsNamesMapToGuest[key] as keyof Guest
      obj[key] = guest[guestKey]
      if (guestKey === 'side') {
        obj[key] = sideNamesMap[guest.side as string]
      }
    })
    return obj
  })

  const rowsToSheet = XLSX.utils.json_to_sheet([rows[0], ...newRows])
  workbook.Sheets[workbook.SheetNames[0]] = rowsToSheet
  const newWorkbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(newWorkbook, rowsToSheet, workbook.SheetNames[0])
  const newArrayBuffer = XLSX.write(workbook, { type: 'buffer' })
  const fileName = `guest_list_${eventSettings.eventType.toLowerCase()}_${moment().format('DD-MM-YYYY')}.xlsx`
  const newFile = new File([newArrayBuffer], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(newFile)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export {
  validatePhoneNumber,
  validateRealName,
  isNameInGuests,
  STATUS_OPTIONS,
  STATUS_LABELS,
  exportGuestsToExcel,
  exportGuestsCustomExcel,
  importGuestsFromExcel,
  exportToIplanTemplate,
}
