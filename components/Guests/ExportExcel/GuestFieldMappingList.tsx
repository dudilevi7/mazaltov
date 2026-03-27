'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import type { Guest } from '@/types/Guest'

export interface FieldMapping {
  customLabel: string
  ignored: boolean
}

interface GuestFieldMappingListProps {
  columns: { key: keyof Guest; label: string }[]
  fieldMap: Record<string, FieldMapping>
  onLabelChange: (key: string, value: string) => void
  onToggleIgnore: (key: string) => void
}

const GuestFieldMappingList = ({
  columns,
  fieldMap,
  onLabelChange,
  onToggleIgnore,
}: GuestFieldMappingListProps) => (
  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pe-1">
    {columns.map((col) => {
      const mapping = fieldMap[col.key]
      const isIgnored = mapping.ignored

      return (
        <div
          key={col.key}
          className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
            isIgnored ? 'border-gray-100 bg-gray-50 opacity-50' : 'border-gray-200 bg-white hover:border-blue-200'
          }`}>
          <span
            className={`text-sm font-medium min-w-[80px] ${
              isIgnored ? 'line-through text-gray-400' : 'text-gray-700'
            }`}>
            {col.label}
          </span>

          <FontAwesomeIcon icon={faArrowLeftLong} className="text-gray-300 text-xs" />

          <input
            type="text"
            value={mapping.customLabel}
            onChange={(e) => onLabelChange(col.key, e.target.value)}
            placeholder={col.label}
            disabled={isIgnored}
            className={`flex-1 text-sm border rounded-md px-2.5 py-1.5 outline-none transition-all ${
              isIgnored
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100'
            }`}
          />

          <button
            type="button"
            onClick={() => onToggleIgnore(col.key)}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              isIgnored
                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                : 'text-red-400 hover:text-red-600 hover:bg-red-50'
            }`}>
            <FontAwesomeIcon icon={isIgnored ? faEye : faEyeSlash} className="text-sm" />
          </button>
        </div>
      )
    })}
  </div>
)

export default GuestFieldMappingList
