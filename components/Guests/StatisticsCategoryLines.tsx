'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Guest } from '@/types/Guest'

const CATEGORY_CHART_NAMES = { total: 'סה"כ', approved: 'אושרו' } as const

type LineTooltipItem = { dataKey?: string | number; value?: number }

const CategoryChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: ReadonlyArray<LineTooltipItem>
  label?: string | number
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-800 shadow-sm" dir="rtl">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="text-gray-600">
          {CATEGORY_CHART_NAMES[p.dataKey as keyof typeof CATEGORY_CHART_NAMES]}: {p.value}
        </p>
      ))}
    </div>
  )
}

export interface CategoryLinePoint {
  name: string
  total: number
  approved: number
}

interface StatisticsCategoryLinesProps {
  guests: Guest[]
  title: string
}

const StatisticsCategoryLines = ({ guests, title }: StatisticsCategoryLinesProps) => {
  const data: CategoryLinePoint[] = useMemo(() => {
    const map: Record<string, { total: number; approved: number }> = {}
    guests.forEach((g: Guest) => {
      const key = g.category?.trim() || 'ללא קטגוריה'
      if (!map[key]) map[key] = { total: 0, approved: 0 }
      map[key].total += g.quantity
      map[key].approved += g.approved ?? 0
    })
    return Object.entries(map)
      .filter(([, v]) => v.total > 0)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, v]) => ({ name, total: v.total, approved: v.approved }))
  }, [guests])

  if (data.length === 0) {
    return <div className="text-center text-gray-400 py-6 text-sm">{title} - אין נתונים</div>
  }

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="w-full h-[300px] min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
              height={data.length > 4 ? 56 : 32}
              angle={data.length > 4 ? -35 : 0}
              textAnchor={data.length > 4 ? 'end' : 'middle'}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={40} />
            <Tooltip content={<CategoryChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(v) => CATEGORY_CHART_NAMES[v as 'total' | 'approved']}
            />
            <Bar
              dataKey="total"
              name="total"
              fill="var(--color-gray-300)"
              radius={[4, 4, 0, 0]}
              maxBarSize={34}
            />
            <Bar
              dataKey="approved"
              name="approved"
              fill="var(--color-yellow-500)"
              radius={[4, 4, 0, 0]}
              maxBarSize={34}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StatisticsCategoryLines
