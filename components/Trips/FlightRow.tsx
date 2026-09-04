'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faChevronDown, faPlane, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import type { Flight } from '@/types/Trip'
import { formatTripCost, formatTripDateTime } from './helper'
import TripItemActions from './TripItemActions'
import { useAppContext } from '@/context/AppContext'
import { getTripCopy } from '@/constants/trips'
import { LanguageDirection } from '@/types/General'

export const AnimateCollapse = ({ open, children }: { open: boolean; children: React.ReactNode }) => (
  <div
    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
    }`}>
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
)

interface FlightRowProps {
  flight: Flight
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
  pairedReturn?: Flight
  isGrouped?: boolean
  onToggleGroup?: () => void
  nested?: boolean
}

const FlightBody = ({
  flight,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  flight: Flight
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const showRoundTripPrice = !flight.isReturn && !!flight.returnFlightId && flight.price > 0
  const showOneWayPrice = !flight.isReturn && !flight.returnFlightId && flight.price > 0

  return (
    <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3">
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

const FlightRow = ({
  flight,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  pairedReturn,
  isGrouped = false,
  onToggleGroup,
  nested = false,
}: FlightRowProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const canGroup = !!pairedReturn && !!onToggleGroup

  return (
    <div
      className={
        nested
          ? 'rounded-md border border-gray-200 bg-white'
          : `overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-[box-shadow,border-color] duration-300 ${
              isGrouped ? '!bg-blue-50 border-blue-200 shadow-md' : ''
            }`
      }>
      <FlightBody flight={flight} onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
      {canGroup && (
        <>
          <button
            type="button"
            aria-expanded={isGrouped}
            aria-label={copy.groupReturnFlight}
            onClick={onToggleGroup}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-gray-100 py-1.5 text-xs text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-3 w-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isGrouped ? 'rotate-180' : ''
              }`}
            />
            <span>{copy.groupReturnFlight}</span>
          </button>
          <AnimateCollapse open={isGrouped}>
            <div
              aria-hidden={!isGrouped}
              className={`border-t border-gray-100 bg-blue-50 px-2.5 pb-2.5 pt-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isGrouped ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
              }`}>
              <FlightRow
                flight={pairedReturn}
                nested
                onEdit={onEdit}
                onDelete={onDelete}
                editLabel={editLabel}
                deleteLabel={deleteLabel}
              />
            </div>
          </AnimateCollapse>
        </>
      )}
    </div>
  )
}

export default FlightRow
