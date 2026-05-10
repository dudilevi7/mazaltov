import { GiftType } from '@/types/Gift'
import type { Gift } from '@/types/Gift'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import * as XLSX from 'xlsx-js-style'
import moment from 'moment'
import { buildGiftsPrintHtml } from './giftsPrintHtml'

const HEADER_STYLE = {
  fill: { fgColor: { rgb: 'FF2563B5' }, patternType: 'solid' as const },
  font: { color: { rgb: 'FFFFFFFF' }, bold: true, sz: 12 },
}
const SUMMARY_STYLE = {
  fill: { fgColor: { rgb: 'FFE5E7EB' }, patternType: 'solid' as const },
  font: { bold: true, sz: 12 },
}
const COLUMN_KEYS = ['שם אורח', 'צד', 'קירבה', 'סכום', 'סוג', 'תיאור', 'עודכן']
const COLS_WIDTH = 16
const NUM_SUMMARY_COLS = 7

export const GIFT_TYPE_LABELS: Record<string, string> = {
  [GiftType.CASH]: 'מזומן',
  [GiftType.CHECK]: 'צ׳ק',
  [GiftType.BIT]: 'ביט',
  [GiftType.PAYBOX]: 'פייבוקס',
  [GiftType.CREDIT_CARD]: 'אשראי',
  [GiftType.TRANSFER]: 'העברה בנקאית',
  [GiftType.PHYSICAL]: 'מתנה פיזית',
  [GiftType.OTHER]: 'אחר',
}

export const GIFT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'הכל' },
  { value: GiftType.CASH, label: GIFT_TYPE_LABELS[GiftType.CASH] },
  { value: GiftType.CHECK, label: GIFT_TYPE_LABELS[GiftType.CHECK] },
  { value: GiftType.BIT, label: GIFT_TYPE_LABELS[GiftType.BIT] },
  { value: GiftType.PAYBOX, label: GIFT_TYPE_LABELS[GiftType.PAYBOX] },
  { value: GiftType.CREDIT_CARD, label: GIFT_TYPE_LABELS[GiftType.CREDIT_CARD] },
  { value: GiftType.TRANSFER, label: GIFT_TYPE_LABELS[GiftType.TRANSFER] },
  { value: GiftType.PHYSICAL, label: GIFT_TYPE_LABELS[GiftType.PHYSICAL] },
  { value: GiftType.OTHER, label: GIFT_TYPE_LABELS[GiftType.OTHER] },
]

export const GIFT_TYPE_COLORS: Record<string, string> = {
  [GiftType.CASH]: 'bg-green-100 text-green-800',
  [GiftType.CHECK]: 'bg-blue-100 text-blue-800',
  [GiftType.BIT]: 'bg-purple-100 text-purple-800',
  [GiftType.PAYBOX]: 'bg-green-100 text-green-800',
  [GiftType.CREDIT_CARD]: 'bg-red-100 text-red-800',
  [GiftType.TRANSFER]: 'bg-purple-100 text-purple-800',
  [GiftType.PHYSICAL]: 'bg-yellow-100 text-yellow-800',
  [GiftType.OTHER]: 'bg-gray-100 text-gray-800',
}

export type GuestNameDuplicateGroup = {
  displayName: string
  count: number
}

export const buildGuestNameDuplicateInfo = (
  gifts: Gift[]
): { keys: Set<string>; groups: GuestNameDuplicateGroup[] } => {
  const byKey = new Map<string, string[]>()
  for (const g of gifts) {
    const raw = (g.guestName ?? '').trim()
    if (!raw) continue
    const key = raw.toLowerCase()
    const arr = byKey.get(key)
    if (arr) arr.push(raw)
    else byKey.set(key, [raw])
  }
  const keys = new Set<string>()
  const groups: GuestNameDuplicateGroup[] = []
  for (const [key, names] of byKey) {
    if (names.length >= 2) {
      keys.add(key)
      groups.push({ displayName: names[0], count: names.length })
    }
  }
  groups.sort((a, b) => b.count - a.count || a.displayName.localeCompare(b.displayName, 'he'))
  return { keys, groups }
}

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })

export const buildGiftActiveFilterLines = ({
  searchQuery,
  sideLabel,
  categoryValues,
  typeValue,
}: {
  searchQuery: string
  sideLabel: string | null
  categoryValues: string[]
  typeValue: string
}): string[] => {
  const lines: string[] = []
  const q = searchQuery.trim()
  if (q) lines.push(`חיפוש: «${q}»`)
  if (sideLabel) lines.push(`צד: ${sideLabel}`)
  if (categoryValues.length > 0) lines.push(`קירבה: ${categoryValues.join(', ')}`)
  if (typeValue !== 'all') lines.push(`סוג מתנה: ${GIFT_TYPE_LABELS[typeValue] ?? typeValue}`)
  return lines
}

export const buildAmountSummaryForGifts = (
  gifts: Gift[]
): { totalAmount: number; amountByType: Record<string, number> } => {
  const amountByType: Record<string, number> = {}
  Object.values(GiftType).forEach((t) => {
    amountByType[t] = 0
  })
  let totalAmount = 0
  for (const g of gifts) {
    totalAmount += g.amount
    amountByType[g.type] = (amountByType[g.type] || 0) + g.amount
  }
  return { totalAmount, amountByType }
}

export const exportGiftsToExcel = (gifts: Gift[], totalAmount: number, amountByType: Record<string, number>): void => {
  const rows = gifts.map((gift) => ({
    'שם אורח': gift.guestName,
    צד: gift.guestSide,
    קירבה: gift.guestCategory,
    סכום: gift.amount,
    סוג: GIFT_TYPE_LABELS[gift.type] ?? gift.type,
    תיאור: gift.description,
    עודכן: gift.updatedAt ? moment(gift.updatedAt).format('DD/MM/YYYY') : '',
  }))
  const sheet = XLSX.utils.json_to_sheet(rows)
  sheet['!cols'] = COLUMN_KEYS.map(() => ({ wch: COLS_WIDTH }))
  for (let c = 0; c < COLUMN_KEYS.length; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c })
    if (sheet[ref]) sheet[ref].s = HEADER_STYLE
  }

  const summaryOrigin = 1 + rows.length
  const averageGift = gifts.length > 0 ? totalAmount / gifts.length : 0
  setGiftsSummaryToSheet(sheet, totalAmount, averageGift, amountByType, summaryOrigin)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'מתנות')
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx', cellStyles: true })
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gifts-${moment().format('DD-MM-YYYY')}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportGiftsToPdf = async (
  gifts: Gift[],
  totalAmount: number,
  amountByType: Record<string, number>
): Promise<void> => {
  const html = buildGiftsPrintHtml(gifts, totalAmount, amountByType)
  const printWindow = window.open('', '_blank', 'width=1024,height=768')
  if (!printWindow) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
    return
  }
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

const setGiftsSummaryToSheet = (
  sheet: XLSX.WorkSheet,
  totalAmount: number,
  averageGift: number,
  amountByType: Record<string, number>,
  summaryOrigin: number
) => {
  const summaryRows: string[][] = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', formatCurrency(totalAmount), 'סה״כ מתנות'],
    ['', '', '', '', '', formatCurrency(averageGift), 'מתנה ממוצעת'],
    ...Object.entries(amountByType).map(([type, amount]) => [
      '',
      '',
      '',
      '',
      '',
      formatCurrency(amount),
      GIFT_TYPE_LABELS[type],
    ]),
    ['', '', '', '', '', '', ''],
  ]
  XLSX.utils.sheet_add_aoa(sheet, summaryRows, { origin: summaryOrigin })
  for (let r = 0; r < summaryRows.length; r++) {
    for (let c = 0; c < NUM_SUMMARY_COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: summaryOrigin + r, c })
      if (sheet[ref]) sheet[ref].s = SUMMARY_STYLE
    }
  }
}
