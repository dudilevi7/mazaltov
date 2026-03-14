import type { Provider } from '@/types/Provider'
import * as XLSX from 'xlsx'
import moment from 'moment'
import { LanguageDirection } from '@/types/General'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'מזומן',
  transfer: 'העברה בנקאית',
  bit: 'ביט',
  paybox: 'פייבוקס',
  credit_card: 'אשראי',
  check: 'צ׳ק',
  other: 'אחר',
}

const EXPENSES_COLUMNS: { key: keyof Provider; labelHe: string; labelEn: string }[] = [
  { key: 'service', labelHe: 'ספק', labelEn: 'Provider' },
  { key: 'name', labelHe: 'שם', labelEn: 'Name' },
  { key: 'price', labelHe: 'מחיר', labelEn: 'Price' },
  { key: 'advancePayment', labelHe: 'מקדמה', labelEn: 'Advance Payment' },
  { key: 'toBePaid', labelHe: 'יתרה לתשלום', labelEn: 'To Be Paid' },
  { key: 'paymentMethod', labelHe: 'שיטת תשלום', labelEn: 'Payment Method' },
]

const exportExpensesToExcel = (providers: Provider[], languageDirection: LanguageDirection): void => {
  const isRTL = languageDirection === 'rtl'
  const labelField = isRTL ? 'labelHe' : 'labelEn'
  const rows = providers.map((provider) => {
    const obj: Record<string, string | number> = {}
    EXPENSES_COLUMNS.forEach((col) => {
      let val: string | number = provider[col.key] as string | number
      if (col.key === 'paymentMethod') {
        val = isRTL ? PAYMENT_METHOD_LABELS[val] : val
      }
      obj[col[labelField]] = val ?? ''
    })
    return obj
  })
  const rowsByRTLorLTR = isRTL ? rows.reverse() : rows
  const sheet = XLSX.utils.json_to_sheet(rowsByRTLorLTR)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, isRTL ? 'הוצאות' : 'Expenses')
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `expenses-${moment().format('DD-MM-YYYY')}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

export { exportExpensesToExcel }
