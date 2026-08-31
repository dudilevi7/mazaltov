'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faCamera,
  faHotel,
  faListCheck,
  faPen,
  faPlane,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import type { Trip } from '@/types/Trip'
import { TripCurrency } from '@/types/Trip'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { getTripCopy, TRIP_TYPE_META } from '@/constants/trips'
import ActionButton, { ActionButtonSize, ActionButtonVariant } from '@/components/Button/action-button'
import { computeTripDateRange, computeTripTotals, formatTripCost, hasAnyCost } from './helper'

interface TripCardProps {
  trip: Trip
  onOpen: (trip: Trip) => void
  onEdit: (trip: Trip) => void
  onDelete: (trip: Trip) => void
  editLabel: string
  deleteLabel: string
}

const TripCard = ({ trip, onOpen, onEdit, onDelete, editLabel, deleteLabel }: TripCardProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const meta = TRIP_TYPE_META[trip.tripType]
  const totals = computeTripTotals(trip)
  const dateRange = computeTripDateRange(trip)
  const doneTasks = trip.tasks.filter((t) => t.isDone).length

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(trip)
    }
  }

  const stats = [
    { icon: faPlane, label: copy.flightsCount, value: String(trip.flights.length) },
    { icon: faHotel, label: copy.hotelsCount, value: String(trip.hotels.length) },
    { icon: faCamera, label: copy.attractionsCount, value: String(trip.attractions.length) },
    { icon: faListCheck, label: copy.tasksCount, value: `${doneTasks}/${trip.tasks.length}` },
  ]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(trip)}
      onKeyDown={handleKeyDown}
      className="flex min-h-52 cursor-pointer flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm animate-fade-in-0.5 sm:p-6"
      dir={languageDirection}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <FontAwesomeIcon icon={meta.icon} className={`${meta.color} text-lg`} />
            <span className="text-xl font-semibold text-gray-800">{trip.name}</span>
          </div>
          <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {isRtl ? meta.he : meta.en}
          </span>
        </div>

        {dateRange && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
            <span>
              {dateRange.start}
              {dateRange.end !== dateRange.start ? ` – ${dateRange.end}` : ''}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
          {stats.map((stat) => (
            <span key={stat.label} className="flex items-center gap-2">
              <FontAwesomeIcon icon={stat.icon} className="w-4 text-gray-400" />
              <span>
                {stat.label}: <strong className="font-medium text-gray-800">{stat.value}</strong>
              </span>
            </span>
          ))}
        </div>

        {hasAnyCost(totals) && (
          <div className="flex flex-wrap gap-1">
            {(Object.entries(totals) as [TripCurrency, number][]).map(([currency, amount]) => (
              <span key={currency} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                {formatTripCost(amount, currency)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-0.5 border-t border-gray-200 pt-3">
        <ActionButton
          icon={faTrash}
          variant={ActionButtonVariant.DELETE}
          size={ActionButtonSize.SM}
          tooltip={deleteLabel}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(trip)
          }}
        />
        <ActionButton
          icon={faPen}
          variant={ActionButtonVariant.EDIT}
          size={ActionButtonSize.SM}
          tooltip={editLabel}
          onClick={(e) => {
            e.stopPropagation()
            onEdit(trip)
          }}
        />
      </div>
    </div>
  )
}

export default TripCard
