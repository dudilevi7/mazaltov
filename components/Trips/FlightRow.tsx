'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faPlane, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import type { Flight } from '@/types/Trip'
import { formatTripCost, formatTripDateTime } from './helper'
import TripItemActions from './TripItemActions'
import { useAppContext } from '@/context/AppContext'
import { getTripCopy } from '@/constants/trips'
import { LanguageDirection } from '@/types/General'

interface FlightRowProps {
  flight: Flight
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

const FlightRow = ({ flight, onEdit, onDelete, editLabel, deleteLabel }: FlightRowProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const showRoundTripPrice = !flight.isReturn && !!flight.returnFlightId && flight.price > 0
  const showOneWayPrice = !flight.isReturn && !flight.returnFlightId && flight.price > 0

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3">
      <FontAwesomeIcon icon={flight.isReturn ? faPlaneArrival : faPlane} className="shrink-0 text-gray-500" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-900">{flight.flightCompany || '—'}</span>
          <span className="text-sm text-gray-700" dir={languageDirection}>
            {flight.source} {'←'} {flight.destination}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {formatTripDateTime(flight.departureAt)}
          {flight.arrivalAt ? ` – ${formatTripDateTime(flight.arrivalAt)}` : ''}
        </div>
        {flight.connection && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-xs" />
            {flight.connection}
          </div>
        )}
        {showRoundTripPrice && (
          <div className="mt-1 text-sm text-gray-700">
            {copy.roundTripPrice} — <strong>{formatTripCost(flight.price, flight.currency)}</strong>
          </div>
        )}
      </div>
      {showOneWayPrice && (
        <span className="shrink-0 text-sm font-medium text-gray-700">
          {formatTripCost(flight.price, flight.currency)}
        </span>
      )}
      <TripItemActions onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
    </div>
  )
}

export default FlightRow
