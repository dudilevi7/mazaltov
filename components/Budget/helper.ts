import type { Provider } from '@/types/Provider'
import * as XLSX from 'xlsx-js-style'
import moment from 'moment'
import { LanguageDirection } from '@/types/General'

const HEADER_STYLE = {
  fill: { fgColor: { rgb: 'FF2563B5' }, patternType: 'solid' as const },
  font: { color: { rgb: 'FFFFFFFF' }, bold: true, sz: 12 },
}
const SUMMARY_STYLE = {
  fill: { fgColor: { rgb: 'FFE5E7EB' }, patternType: 'solid' as const },
  font: { bold: true, sz: 12 },
}
const PAID_ROW_STYLE = {
  fill: { fgColor: { rgb: 'FFDCFCE7' }, patternType: 'solid' as const },
}
const COLS_WIDTH = 18

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
  { key: 'name', labelHe: 'שם', labelEn: 'Name' },
  { key: 'service', labelHe: 'ספק', labelEn: 'Provider' },
  { key: 'price', labelHe: 'מחיר', labelEn: 'Price' },
  { key: 'advancePayment', labelHe: 'מקדמה', labelEn: 'Advance Payment' },
  { key: 'toBePaid', labelHe: 'יתרה לתשלום', labelEn: 'To Be Paid' },
  { key: 'paymentMethod', labelHe: 'שיטת תשלום', labelEn: 'Payment Method' },
]

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })

const buildRows = (providers: Provider[], isRTL: boolean) => {
  const labelField = isRTL ? 'labelHe' : 'labelEn'
  const rows = providers.map((provider) => {
    const obj: Record<string, string | number> = {}
    EXPENSES_COLUMNS.forEach((col) => {
      let val: string | number = provider[col.key] as string | number
      if (col.key === 'paymentMethod') val = isRTL ? PAYMENT_METHOD_LABELS[val] : val
      obj[col[labelField]] = val ?? ''
    })
    return obj
  })
  return isRTL ? rows.reverse() : rows
}

const applyHeaderStyle = (sheet: XLSX.WorkSheet, colCount: number) => {
  sheet['!cols'] = EXPENSES_COLUMNS.map(() => ({ wch: COLS_WIDTH }))
  for (let c = 0; c < colCount; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c })
    if (sheet[ref]) sheet[ref].s = HEADER_STYLE
  }
}

const applyPaidRowStyles = (sheet: XLSX.WorkSheet, providers: Provider[], colCount: number, isRTL: boolean) => {
  const ordered = isRTL ? [...providers].reverse() : providers
  ordered.forEach((provider, i) => {
    if (provider.toBePaid > 0) return
    const row = i + 1
    for (let c = 0; c < colCount; c++) {
      const ref = XLSX.utils.encode_cell({ r: row, c })
      if (sheet[ref]) sheet[ref].s = PAID_ROW_STYLE
    }
  })
}

const appendSummaryBlock = (
  sheet: XLSX.WorkSheet,
  providers: Provider[],
  colCount: number,
  isRTL: boolean,
  rowCount: number
) => {
  const totalPrice = providers.reduce((s, p) => s + p.price, 0)
  const totalPaid = providers.reduce((s, p) => s + p.advancePayment, 0)
  const totalToBePaid = providers.reduce((s, p) => s + p.toBePaid, 0)
  const summaryOrigin = 1 + rowCount
  const empty = Array(colCount).fill('')
  const summaryRows: (string | number)[][] = [
    empty,
    [...Array(colCount - 2).fill(''), formatCurrency(totalPrice), isRTL ? 'סה״כ הוצאות' : 'Total Expenses'],
    [...Array(colCount - 2).fill(''), formatCurrency(totalPaid), isRTL ? 'שולם' : 'Paid'],
    [...Array(colCount - 2).fill(''), formatCurrency(totalToBePaid), isRTL ? 'נותר לתשלום' : 'To Be Paid'],
    empty,
  ]
  XLSX.utils.sheet_add_aoa(sheet, summaryRows, { origin: summaryOrigin })
  for (let r = 0; r < summaryRows.length; r++) {
    for (let c = 0; c < colCount; c++) {
      const ref = XLSX.utils.encode_cell({ r: summaryOrigin + r, c })
      if (sheet[ref]) sheet[ref].s = SUMMARY_STYLE
    }
  }
}

const downloadWorkbook = (workbook: XLSX.WorkBook) => {
  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx', cellStyles: true })
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

const exportExpensesToExcel = (providers: Provider[], languageDirection: LanguageDirection): void => {
  const isRTL = languageDirection === 'rtl'
  const colCount = EXPENSES_COLUMNS.length
  const rows = buildRows(providers, isRTL)
  const sheet = XLSX.utils.json_to_sheet(rows)

  applyHeaderStyle(sheet, colCount)
  applyPaidRowStyles(sheet, providers, colCount, isRTL)
  appendSummaryBlock(sheet, providers, colCount, isRTL, rows.length)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, isRTL ? 'הוצאות' : 'Expenses')
  downloadWorkbook(workbook)
}

export { exportExpensesToExcel }
