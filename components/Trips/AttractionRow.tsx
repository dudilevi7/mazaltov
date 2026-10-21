'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import type { Attraction } from '@/types/Trip'
import { formatTripCost, formatTripDate } from './helper'
import TripItemActions from './TripItemActions'
import PlaceFlag from './PlaceFlag'

interface AttractionRowProps {
  attraction: Attraction
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

const AttractionRow = ({ attraction, onEdit, onDelete, editLabel, deleteLabel }: AttractionRowProps) => {
  const location = attraction.location?.trim() ?? ''
  const date = attraction.date ? formatTripDate(attraction.date) : ''
  const hasMeta = date || location

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3">
      <FontAwesomeIcon icon={faCamera} className="shrink-0 text-gray-500" />
      <div className="min-w-0 flex-1">
        <span className="font-medium text-gray-900">{attraction.name}</span>
        {hasMeta ? (
          <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-500">
            {date ? <span>{date}</span> : null}
            {date && location ? <span>·</span> : null}
            {location ? (
              <span className="inline-flex items-center gap-1">
                <PlaceFlag countryCode={attraction.countryCode} />
                {location}
              </span>
            ) : null}
          </div>
        ) : null}
        {attraction.description ? (
          <div className="whitespace-pre-wrap text-sm text-gray-500">{attraction.description}</div>
        ) : null}
      </div>
      {attraction.price > 0 && (
        <span className="shrink-0 text-sm font-medium text-gray-700">
          {formatTripCost(attraction.price, attraction.currency)}
        </span>
      )}
      <TripItemActions onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
    </div>
  )
}

export default AttractionRow
