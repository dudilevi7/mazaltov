import * as XLSX from 'xlsx-js-style'
import moment from 'moment'
import type { Guest } from '@/types/Guest'
import { GuestStatus } from '@/types/Guest'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'

const HEADER_STYLE = {
  fill: { fgColor: { rgb: 'FF2563B5' }, patternType: 'solid' as const },
  font: { color: { rgb: 'FFFFFFFF' }, bold: true, sz: 12 },
}

export const MAZALTOV_COLUMNS: { key: keyof Guest; label: string }[] = [
  { key: 'name', label: 'שם' },
  { key: 'phoneNumber', label: 'טלפון' },
  { key: 'quantity', label: 'כמות' },
  { key: 'side', label: 'צד' },
  { key: 'category', label: 'קבוצה' },
  { key: 'notes', label: 'הערות' },
]

export type ParsedImportGuest = Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>

export type ImportRowError = {
  row: number
  message: string
}

export type ParseResult = {
  guests: ParsedImportGuest[]
  errors: ImportRowError[]
}

export const downloadMazalTovTemplate = () => {
  const headers = MAZALTOV_COLUMNS.map((c) => c.label)
  const sheet = XLSX.utils.aoa_to_sheet([headers])
  sheet['!cols'] = headers.map(() => ({ wch: 18 }))
  for (let c = 0; c < headers.length; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c })
    if (sheet[ref]) sheet[ref].s = HEADER_STYLE
  }
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, 'אורחים')
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx', cellStyles: true })
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mazaltov-template-${moment().format('DD-MM-YYYY')}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'))
    reader.readAsArrayBuffer(file)
  })

export const parseMazalTovExcel = (buffer: ArrayBuffer): ParseResult => {
  const wb = XLSX.read(buffer, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  if (!sheet || !sheet['!ref']) {
    return { guests: [], errors: [{ row: 0, message: 'הקובץ ריק או לא תקין' }] }
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
  if (rows.length === 0) {
    return { guests: [], errors: [{ row: 0, message: 'לא נמצאו שורות בקובץ' }] }
  }

  const guests: ParsedImportGuest[] = []
  const errors: ImportRowError[] = []

  rows.forEach((row, i) => {
    const rowNum = i + 2
    const name = String(row['שם'] ?? '').trim()

    if (!name) {
      errors.push({ row: rowNum, message: `שורה ${rowNum}: שם חסר` })
      return
    }
    if (name.length < 2) {
      errors.push({ row: rowNum, message: `שורה ${rowNum}: שם "${name}" קצר מדי` })
      return
    }

    const rawQty = row['כמות'] ?? row['כמות מוזמנים'] ?? 1
    const quantity = Number(rawQty)
    if (isNaN(quantity) || quantity < 1) {
      errors.push({ row: rowNum, message: `שורה ${rowNum}: כמות לא תקינה (${rawQty})` })
      return
    }

    guests.push({
      name,
      phoneNumber: String(row['טלפון'] ?? '').trim() || undefined,
      quantity: Math.max(1, Math.round(quantity)),
      side: String(row['צד'] ?? '').trim(),
      category: String(row['קבוצה'] ?? row['קירבה'] ?? '').trim(),
      notes: String(row['הערות'] ?? '').trim() || undefined,
      status: GuestStatus.PENDING,
      gift: 0,
      manualApproval: false,
    })
  })

  return { guests, errors }
}

export const saveImportedGuests = async (guests: ParsedImportGuest[]): Promise<Guest[]> => {
  return fetchData<{ guests: ParsedImportGuest[] }, Guest[]>({
    url: `${API_URL}${API_ROUTES.GUESTS_IMPORT}`,
    method: METHODS.POST,
    body: { guests },
  })
}
