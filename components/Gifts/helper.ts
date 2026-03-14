import { GiftType } from '@/types/Gift'
import type { Gift } from '@/types/Gift'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import * as XLSX from 'xlsx'
import moment from 'moment'

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

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })

export const exportGiftsToExcel = (gifts: Gift[]): void => {
  const rows = gifts.map((gift) => ({
    'שם אורח': gift.guestName,
    צד: gift.guestSide,
    קירבה: gift.guestCategory,
    סכום: gift.amount,
    סוג: GIFT_TYPE_LABELS[gift.type] ?? gift.type,
    תיאור: gift.description,
    עודכן: gift.updatedAt ? moment(gift.updatedAt).format('DD/MM/YYYY') : '',
  }))
  const sheet = XLSX.utils.json_to_sheet(rows.reverse())
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'מתנות')
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
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
