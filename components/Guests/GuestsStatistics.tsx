'use client'

import { useMemo } from 'react'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import { getSideOptions } from './helper'
import type { Guest } from '@/types/Guest'
import StatisticsInteractivePie, { type ChartEntry } from './StatisticsInteractivePie'
import StatisticsCategoryLines from './StatisticsCategoryLines'
import GuestsStatusStats from './GuestsStatusStats'

const SIDE_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981']
const CATEGORY_COLORS = [
  '#6366f1',
  '#f43f5e',
  '#14b8a6',
  '#f97316',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#e879f9',
  '#facc15',
  '#64748b',
]

const GuestsStatistics = () => {
  const { guests } = useGuestsContext()
  const { eventSettings } = useAppContext()
  const sideOptions = useMemo(() => getSideOptions(eventSettings), [eventSettings])

  const sideData: ChartEntry[] = useMemo(() => {
    const map: Record<string, number> = {}
    sideOptions.forEach((opt) => {
      map[opt.label] = 0
    })
    guests.forEach((g: Guest) => {
      const label = g.side || 'אחר'
      map[label] = (map[label] || 0) + g.quantity
    })
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [guests, sideOptions])

  const categoryData: ChartEntry[] = useMemo(() => {
    const map: Record<string, number> = {}
    guests.forEach((g: Guest) => {
      const category = g.category?.trim() || 'ללא קטגוריה'
      map[category] = (map[category] || 0) + g.quantity
    })
    return Object.entries(map)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
  }, [guests])

  return (
    <div className="flex flex-col gap-8 animate-fade-in" dir="rtl">
      <GuestsStatusStats />
      <div className="border-t border-gray-200" />
      <StatisticsInteractivePie data={sideData} colors={SIDE_COLORS} title="אורחים לפי צד" />
      <div className="border-t border-gray-200" />
      <StatisticsInteractivePie data={categoryData} colors={CATEGORY_COLORS} title="אורחים לפי קירבה" />
      <div className="border-t border-gray-200" />
      <StatisticsCategoryLines guests={guests} title="קירבה: סה״כ מול אושרו" />
    </div>
  )
}

export default GuestsStatistics
