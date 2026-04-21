'use client'

import CustomSlideover from '@/components/Shared/CustomSlideover'
import Toggle from '@/components/Shared/Toggle'
import { useGuestsContext } from '@/context/GuestsContext'

interface GuestsMoreFiltersProps {
  isOpen: boolean
  onClose: () => void
}

const FILTER_ROWS = [
  { key: 'vegan', label: 'טבעוני' },
  { key: 'vegetarian', label: 'צמחוני' },
  { key: 'glatKosher', label: 'גלאט כשר' },
  { key: 'transportation', label: 'הסעות' },
] as const

const GuestsMoreFilters = ({ isOpen, onClose }: GuestsMoreFiltersProps) => {
  const {
    veganFilter,
    setVeganFilter,
    vegetarianFilter,
    setVegetarianFilter,
    glatKosherFilter,
    setGlatKosherFilter,
    transportationFilter,
    setTransportationFilter,
  } = useGuestsContext()

  const setters = {
    vegan: setVeganFilter,
    vegetarian: setVegetarianFilter,
    glatKosher: setGlatKosherFilter,
    transportation: setTransportationFilter,
  }

  const values = {
    vegan: veganFilter,
    vegetarian: vegetarianFilter,
    glatKosher: glatKosherFilter,
    transportation: transportationFilter,
  }

  return (
    <CustomSlideover isOpen={isOpen} onClose={onClose} title="מסננים נוספים">
      <div className="flex flex-col" dir="rtl">
        <p className="mb-4 text-sm text-gray-500">הפעל מסנן כדי להציג רק אורחים עם המאפיין המתאים</p>
        {FILTER_ROWS.map(({ key, label }, i) => {
          const active = values[key]
          return (
            <div
              key={key}
              className={`flex items-center justify-between px-1 py-3 ${i < FILTER_ROWS.length - 1 ? 'border-b border-gray-100' : ''} transition-colors`}>
              <span className={`text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-700'}`}>{label}</span>
              <Toggle enabled={active} onChange={(v) => setters[key](v)} />
            </div>
          )
        })}
      </div>
    </CustomSlideover>
  )
}

export default GuestsMoreFilters
