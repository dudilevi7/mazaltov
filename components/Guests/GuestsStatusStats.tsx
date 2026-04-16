'use client'

import { useMemo } from 'react'
import { useGuestsContext } from '@/context/GuestsContext'
import { GuestStatus, type Guest } from '@/types/Guest'

const ACCENT_ACCEPTED = '#0f766e'
const ACCENT_DECLINED = '#be185d'
const TRACK_PENDING = '#cbd5e1'

const GuestsStatusStats = () => {
  const { guests } = useGuestsContext()

  const { accepted, declined, pending, total } = useMemo(() => {
    let a = 0
    let d = 0
    let p = 0
    guests.forEach((g: Guest) => {
      const q = g.quantity
      if (g.status === GuestStatus.ACCEPTED) a += q
      else if (g.status === GuestStatus.DECLINED) d += q
      else p += q
    })
    return { accepted: a, declined: d, pending: p, total: a + d + p }
  }, [guests])

  const pct = (n: number) => (total > 0 ? ((n / total) * 100).toFixed(1) : '0.0')
  const w = (n: number) => (total > 0 ? (n / total) * 100 : 0)

  if (total === 0) {
    return <div className="text-center text-gray-400 py-6 text-sm">סטטוס הגעה - אין נתונים</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-700">סטטוס הגעה (לפי כמות מוזמנים)</h3>
      <div
        className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80"
        dir="ltr"
        role="img"
        aria-label={`אישרו ${pct(accepted)} אחוז, דחו ${pct(declined)} אחוז`}>
        {accepted > 0 && (
          <div
            className="h-full min-w-0 transition-[width] duration-300"
            style={{ width: `${w(accepted)}%`, backgroundColor: ACCENT_ACCEPTED }}
            title={`אישרו: ${pct(accepted)}%`}
          />
        )}
        {declined > 0 && (
          <div
            className="h-full min-w-0 transition-[width] duration-300"
            style={{ width: `${w(declined)}%`, backgroundColor: ACCENT_DECLINED }}
            title={`דחו: ${pct(declined)}%`}
          />
        )}
        {pending > 0 && (
          <div
            className="h-full min-w-0 transition-[width] duration-300"
            style={{ width: `${w(pending)}%`, backgroundColor: TRACK_PENDING }}
            title={`ממתינים: ${pct(pending)}%`}
          />
        )}
      </div>
      <ul className="flex flex-col gap-2 text-sm text-right">
        <li className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-2">
          <span className="flex items-center gap-2 text-gray-700">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: ACCENT_ACCEPTED }} />
            אישרו הגעה
          </span>
          <span className="font-semibold tabular-nums text-gray-900">
            {accepted} <span className="font-normal text-gray-500">({pct(accepted)}%)</span>
          </span>
        </li>
        <li className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-2">
          <span className="flex items-center gap-2 text-gray-700">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: ACCENT_DECLINED }} />
            דחו הגעה
          </span>
          <span className="font-semibold tabular-nums text-gray-900">
            {declined} <span className="font-normal text-gray-500">({pct(declined)}%)</span>
          </span>
        </li>
        {pending > 0 && (
          <li className="flex flex-wrap items-baseline justify-between gap-2 text-gray-600">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-slate-300" />
              ממתינים לתגובה
            </span>
            <span className="tabular-nums">
              {pending} <span className="text-gray-400">({pct(pending)}%)</span>
            </span>
          </li>
        )}
      </ul>
    </div>
  )
}

export default GuestsStatusStats
