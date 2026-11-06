import * as XLSX from 'xlsx-js-style'
import { GuestStatus } from '@/types/Guest'
import { MAZALTOV_COLUMNS, type ImportRowError, type ParsedImportGuest, type ParseResult } from './importGuestsHelper'

export type MazalTovFieldKey = (typeof MAZALTOV_COLUMNS)[number]['key']
export type ColumnMap = Record<string, MazalTovFieldKey | ''>

export const readSheetRows = (buffer: ArrayBuffer): { headers: string[]; rows: Record<string, unknown>[] } => {
  const wb = XLSX.read(buffer, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  if (!sheet || !sheet['!ref']) return { headers: [], rows: [] }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  if (rows.length > 0) return { headers: Object.keys(rows[0]), rows }

  const headerRow = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1 })[0] ?? []
  return { headers: headerRow.map((cell) => String(cell ?? '').trim()).filter(Boolean), rows: [] }
}

export const guessColumnMap = (headers: string[]): ColumnMap => {
  const byLabel = Object.fromEntries(MAZALTOV_COLUMNS.map((column) => [column.label, column.key]))
  return Object.fromEntries(headers.map((header) => [header, byLabel[header.trim()] ?? '']))
}

const cellText = (row: Record<string, unknown>, header?: string) => (header ? String(row[header] ?? '').trim() : '')

export const parseMappedRows = (rows: Record<string, unknown>[], columnMap: ColumnMap): ParseResult => {
  const fieldToHeader: Partial<Record<MazalTovFieldKey, string>> = {}
  Object.entries(columnMap).forEach(([header, key]) => {
    if (key && !fieldToHeader[key]) fieldToHeader[key] = header
  })

  if (!fieldToHeader.name) {
    return { guests: [], errors: [{ row: 0, message: 'חובה למפות עמודה לשדה שם' }] }
  }

  const guests: ParsedImportGuest[] = []
  const errors: ImportRowError[] = []

  rows.forEach((row, index) => {
    const rowNum = index + 2
    const name = cellText(row, fieldToHeader.name)
    if (!name) {
      errors.push({ row: rowNum, message: `שורה ${rowNum}: שם חסר` })
      return
    }
    if (name.length < 2) {
      errors.push({ row: rowNum, message: `שורה ${rowNum}: שם "${name}" קצר מדי` })
      return
    }

    const rawQty = fieldToHeader.quantity ? row[fieldToHeader.quantity] : 1
    const quantity = Number(rawQty === '' || rawQty === undefined ? 1 : rawQty)
    if (isNaN(quantity) || quantity < 1) {
      errors.push({ row: rowNum, message: `שורה ${rowNum}: כמות לא תקינה (${rawQty})` })
      return
    }

    guests.push({
      name,
      phoneNumber: cellText(row, fieldToHeader.phoneNumber) || undefined,
      quantity: Math.max(1, Math.round(quantity)),
      side: cellText(row, fieldToHeader.side),
      category: cellText(row, fieldToHeader.category),
      notes: cellText(row, fieldToHeader.notes) || undefined,
      status: GuestStatus.PENDING,
      gift: 0,
    })
  })

  return { guests, errors }
}

export const assignColumn = (columnMap: ColumnMap, header: string, nextKey: MazalTovFieldKey | ''): ColumnMap => {
  const next = { ...columnMap, [header]: nextKey }
  if (!nextKey) return next
  Object.keys(next).forEach((other) => {
    if (other !== header && next[other] === nextKey) next[other] = ''
  })
  return next
}
