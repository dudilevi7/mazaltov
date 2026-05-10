import type { Gift } from '@/types/Gift'
import moment from 'moment'
import { GIFT_TYPE_LABELS, formatCurrency } from './helper'

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const COLUMNS: { label: string; align?: 'right' | 'left' | 'center' }[] = [
  { label: 'שם אורח' },
  { label: 'צד' },
  { label: 'קירבה' },
  { label: 'סכום', align: 'left' },
  { label: 'סוג' },
  { label: 'תיאור' },
  { label: 'עודכן', align: 'center' },
]

export const buildGiftsPrintHtml = (
  gifts: Gift[],
  totalAmount: number,
  amountByType: Record<string, number>
): string => {
  const generatedAt = moment().format('DD/MM/YYYY HH:mm')
  const averageGift = gifts.length > 0 ? totalAmount / gifts.length : 0

  const rowsHtml = gifts
    .map((gift) => {
      const cells = [
        escapeHtml(gift.guestName || ''),
        escapeHtml(gift.guestSide || ''),
        escapeHtml(gift.guestCategory || ''),
        escapeHtml(formatCurrency(gift.amount)),
        escapeHtml(GIFT_TYPE_LABELS[gift.type] ?? gift.type),
        escapeHtml(gift.description || ''),
        gift.updatedAt ? moment(gift.updatedAt).format('DD/MM/YYYY') : '',
      ]
      return `<tr>${cells.map((c, i) => `<td class="align-${COLUMNS[i].align ?? 'right'}">${c}</td>`).join('')}</tr>`
    })
    .join('')

  const summaryItems = [
    { label: 'סה"כ מתנות', value: formatCurrency(totalAmount), highlight: true },
    { label: 'מתנה ממוצעת', value: formatCurrency(averageGift) },
    { label: 'מספר מתנות', value: String(gifts.length) },
    ...Object.entries(amountByType)
      .filter(([, amount]) => amount > 0)
      .map(([type, amount]) => ({
        label: GIFT_TYPE_LABELS[type] ?? type,
        value: formatCurrency(amount),
      })),
  ]

  const summaryHtml = summaryItems
    .map(
      (item) =>
        `<div class="summary-item${'highlight' in item && item.highlight ? ' summary-item--highlight' : ''}">
           <div class="summary-label">${escapeHtml(item.label)}</div>
           <div class="summary-value">${escapeHtml(item.value)}</div>
         </div>`
    )
    .join('')

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>דוח מתנות</title>
  <style>
    @page { size: A4 landscape; margin: 14mm; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Heebo', 'Assistant', 'Rubik', 'Arial Hebrew', 'David', Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      direction: rtl;
    }
    body { padding: 16px; }
    header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    header .meta { font-size: 12px; color: #6b7280; }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    }
    .summary-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 8px 10px;
      background: #f9fafb;
    }
    .summary-item--highlight {
      background: #eff6ff;
      border-color: #bfdbfe;
    }
    .summary-label { font-size: 11px; color: #6b7280; }
    .summary-value { font-size: 14px; font-weight: 700; margin-top: 2px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    thead th {
      background: #2563b5;
      color: #ffffff;
      font-weight: 700;
      padding: 8px 10px;
      text-align: right;
      border: 1px solid #1d4ed8;
    }
    tbody td {
      padding: 6px 10px;
      border: 1px solid #e5e7eb;
      vertical-align: top;
    }
    tbody tr:nth-child(even) td { background: #f9fafb; }
    .align-right { text-align: right; }
    .align-left { text-align: left; }
    .align-center { text-align: center; }
    .empty {
      text-align: center;
      color: #6b7280;
      padding: 24px;
      border: 1px dashed #e5e7eb;
      border-radius: 8px;
    }
    @media print {
      body { padding: 0; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <h1>דוח מתנות</h1>
    <div class="meta">הופק בתאריך: ${escapeHtml(generatedAt)}</div>
  </header>

  <section class="summary">${summaryHtml}</section>

  ${
    gifts.length === 0
      ? '<div class="empty">אין מתנות להצגה</div>'
      : `<table>
           <thead>
             <tr>${COLUMNS.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('')}</tr>
           </thead>
           <tbody>${rowsHtml}</tbody>
         </table>`
  }

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 150);
    });
    window.addEventListener('afterprint', function () {
      window.close();
    });
  </script>
</body>
</html>`
}
