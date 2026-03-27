import type { Guest } from '@/types/Guest'
import { GuestStatus, GuestSide } from '@/types/Guest'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import type { EventSettings } from '@/types/Settings'
import { EventType } from '@/types/Settings'
import * as XLSX from 'xlsx-js-style'
import moment from 'moment'

const HEADER_STYLE = {
  fill: { fgColor: { rgb: 'FF2563B5' }, patternType: 'solid' as const },
  font: { color: { rgb: 'FFFFFFFF' }, bold: true, sz: 12 },
}
const COLS_WIDTH = 18

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

const applyGuestsSheetStyles = (sheet: XLSX.WorkSheet, colCount: number) => {
  sheet['!cols'] = Array.from({ length: colCount }, () => ({ wch: COLS_WIDTH }))
  for (let c = 0; c < colCount; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c })
    if (sheet[ref]) sheet[ref].s = HEADER_STYLE
  }
}

const downloadGuestsWorkbook = (workbook: XLSX.WorkBook, fileName: string) => {
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx', cellStyles: true })
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

const normalizeExcelHeader = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

type FieldMapLike = Record<string, { customLabel: string; ignored: boolean }>

const resolveGuestTemplateColumns = (
  sheet: XLSX.WorkSheet,
  columns: { key: keyof Guest; label: string }[],
  fieldMap: FieldMapLike
): { resolutions: { key: keyof Guest; col: number }[]; headerRow: number } => {
  const ref = sheet['!ref']
  if (!ref) throw new Error('EMPTY_SHEET')
  const range = XLSX.utils.decode_range(ref)
  const headerRow = range.s.r
  const resolutions: { key: keyof Guest; col: number }[] = []
  const usedCols = new Set<number>()

  for (const col of columns) {
    const fm = fieldMap[String(col.key)]
    if (!fm || fm.ignored) continue
    const want = normalizeExcelHeader(fm.customLabel.trim() || col.label)
    if (!want) continue
    for (let c = range.s.c; c <= range.e.c; c++) {
      if (usedCols.has(c)) continue
      const addr = XLSX.utils.encode_cell({ r: headerRow, c })
      const cell = sheet[addr]
      const h = cell ? String(cell.v ?? '').trim() : ''
      if (h && normalizeExcelHeader(h) === want) {
        resolutions.push({ key: col.key, col: c })
        usedCols.add(c)
        break
      }
    }
  }
  if (resolutions.length === 0) throw new Error('NO_MATCHES')
  return { resolutions, headerRow }
}

const guestValueForExport = (
  g: Guest,
  key: keyof Guest,
  sideLabels?: Record<string, string>
): string | number | boolean => {
  let val = g[key] as string | number | boolean | undefined
  if (key === 'side' && sideLabels && typeof val === 'string') {
    val = sideLabels[val] ?? val
  }
  return val === undefined || val === null ? '' : val
}

const writeCellPreservingStyle = (
  sheet: XLSX.WorkSheet,
  row: number,
  col: number,
  value: string | number | boolean
) => {
  const ref = XLSX.utils.encode_cell({ r: row, c: col })
  const prev = sheet[ref]
  const t: XLSX.ExcelDataType =
    typeof value === 'number' ? 'n' : typeof value === 'boolean' ? 'b' : 's'
  sheet[ref] = { ...prev, v: value, t }
}

export const validateGuestTemplateUpload = (
  arrayBuffer: ArrayBuffer,
  columns: { key: keyof Guest; label: string }[],
  fieldMap: FieldMapLike
): { matchCount: number } => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const { resolutions } = resolveGuestTemplateColumns(sheet, columns, fieldMap)
  return { matchCount: resolutions.length }
}

export const exportGuestsFilledUploadedTemplate = (
  arrayBuffer: ArrayBuffer,
  guests: Guest[],
  columns: { key: keyof Guest; label: string }[],
  fieldMap: FieldMapLike,
  sideLabels: Record<string, string>,
  originalFileName?: string | null
): void => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellStyles: true })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const { resolutions, headerRow } = resolveGuestTemplateColumns(sheet, columns, fieldMap)
  const dataStartRow = headerRow + 1

  const range = XLSX.utils.decode_range(sheet['!ref']!)
  const maxCol = Math.max(range.e.c, ...resolutions.map((r) => r.col))
  if (maxCol > range.e.c) range.e.c = maxCol
  if (guests.length > 0) {
    const lastDataRow = dataStartRow + guests.length - 1
    if (lastDataRow > range.e.r) range.e.r = lastDataRow
  }
  sheet['!ref'] = XLSX.utils.encode_range(range)

  for (let i = 0; i < guests.length; i++) {
    const row = dataStartRow + i
    const guest = guests[i]
    for (const { key, col } of resolutions) {
      const val = guestValueForExport(guest, key, sideLabels)
      writeCellPreservingStyle(sheet, row, col, val)
    }
  }

  const out = XLSX.write(workbook, { type: 'array', bookType: 'xlsx', cellStyles: true })
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const downloadName = originalFileName?.replace(/(\.xlsx?)$/i, '-filled$1') ?? `guests-filled-${moment().format('DD-MM-YYYY')}.xlsx`
  a.download = downloadName
  a.click()
  URL.revokeObjectURL(url)
}

export const downloadGuestsExcelTemplate = (columns: { key: keyof Guest; label: string }[]): void => {
  const headerRow = columns.map((c) => c.label)
  const sheet = XLSX.utils.aoa_to_sheet([headerRow])
  applyGuestsSheetStyles(sheet, headerRow.length)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'אורחים')
  downloadGuestsWorkbook(workbook, `guests-template-${moment().format('DD-MM-YYYY')}.xlsx`)
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
  applyGuestsSheetStyles(sheet, columns.length)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'אורחים')
  downloadGuestsWorkbook(workbook, `guests-${moment().format('DD-MM-YYYY')}.xlsx`)
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
  applyGuestsSheetStyles(sheet, fieldMap.length)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'אורחים')
  downloadGuestsWorkbook(workbook, `guests-custom-${moment().format('DD-MM-YYYY')}.xlsx`)
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

export type DuplicatePhoneGroup = { phone: string; guests: Guest[] }

const getDuplicatePhoneGuests = (guests: Guest[]): DuplicatePhoneGroup[] => {
  const normalize = (p: string) => p.replace(/\D/g, '').replace(/^0/, '972')
  const map = new Map<string, Guest[]>()

  guests.forEach((g) => {
    const raw = g.phoneNumber?.trim()
    if (!raw) return
    const key = normalize(raw)
    if (!key) return
    const arr = map.get(key) || []
    arr.push(g)
    map.set(key, arr)
  })

  return Array.from(map.entries())
    .filter(([, list]) => list.length > 1)
    .map(([phone, list]) => ({ phone, guests: list }))
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
  getDuplicatePhoneGuests,
}
