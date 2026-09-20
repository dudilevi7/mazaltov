'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { AdditionalCost } from '@/types/Trip'
import { formatTripCost, formatTripDate } from './helper'
import TripItemActions from './TripItemActions'
import PlaceFlag from './PlaceFlag'
import { getCostTypeMeta } from '@/constants/trips'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

interface CostRowProps {
  cost: AdditionalCost
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

const CostRow = ({ cost, onEdit, onDelete, editLabel, deleteLabel }: CostRowProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const typeMeta = getCostTypeMeta(cost.costType)
  const location = cost.location?.trim() ?? ''
  const date = cost.date ? formatTripDate(cost.date) : ''
  const description = cost.description?.trim() ?? ''
  const hasMeta = date || location

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3">
      <FontAwesomeIcon icon={typeMeta.icon} className={`shrink-0 ${typeMeta.color}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-900">{cost.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeMeta.pill}`}>
            {isRtl ? typeMeta.he : typeMeta.en}
          </span>
        </div>
        {hasMeta ? (
          <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-500">
            {date ? <span>{date}</span> : null}
            {date && location ? <span>·</span> : null}
            {location ? (
              <span className="inline-flex items-center gap-1">
                <PlaceFlag countryCode={cost.countryCode} />
                {location}
              </span>
            ) : null}
          </div>
        ) : null}
        {description ? <div className="whitespace-pre-wrap text-sm text-gray-500">{description}</div> : null}
      </div>
      {cost.price > 0 && (
        <span className="shrink-0 text-sm font-medium text-gray-700">{formatTripCost(cost.price, cost.currency)}</span>
      )}
      <TripItemActions onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
    </div>
  )
}

export default CostRow
