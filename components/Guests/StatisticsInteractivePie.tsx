'use client'

import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export interface ChartEntry {
  name: string
  value: number
}

interface InteractivePieProps {
  data: ChartEntry[]
  colors: string[]
  title: string
}

const StatisticsInteractivePie = ({ data, colors, title }: InteractivePieProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])
  const visibleData = activeKey ? data.filter((d) => d.name === activeKey) : data

  const handleLegendClick = (name: string) => {
    setActiveKey((prev) => (prev === name ? null : name))
  }

  if (data.length === 0 || total === 0) {
    return <div className="text-center text-gray-400 py-6 text-sm">{title} - אין נתונים</div>
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="flex flex-row items-center gap-4">
        <div className="w-[180px] h-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visibleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={35}
                paddingAngle={2}
                animationDuration={400}>
                {visibleData.map((entry) => {
                  const originalIndex = data.findIndex((d) => d.name === entry.name)
                  return <Cell key={entry.name} fill={colors[originalIndex % colors.length]} />
                })}
              </Pie>
              <Tooltip wrapperClassName="text-xs bg-blue-300 text-gray-700" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.map((entry, index) => {
            const percent = ((entry.value / total) * 100).toFixed(1)
            const isActive = activeKey === entry.name
            const isDimmed = activeKey !== null && !isActive
            return (
              <button
                key={entry.name}
                type="button"
                onClick={() => handleLegendClick(entry.name)}
                className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs cursor-pointer transition-all text-right
                  ${isActive ? 'bg-gray-100 ring-1 ring-gray-300' : ''}
                  ${isDimmed ? 'opacity-40' : 'opacity-100'}
                  hover:bg-gray-50`}>
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="truncate font-medium text-gray-700">{entry.name}</span>
                <span className="text-gray-400 ms-auto whitespace-nowrap">
                  {entry.value} ({percent}%)
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StatisticsInteractivePie
