'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHotel, faLink } from '@fortawesome/free-solid-svg-icons'
import type { Hotel } from '@/types/Trip'
import { formatTripCost, formatTripDate } from './helper'
import TripItemActions from './TripItemActions'

interface HotelRowProps {
  hotel: Hotel
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
  bookingLabel: string
}

const HotelRow = ({ hotel, onEdit, onDelete, editLabel, deleteLabel, bookingLabel }: HotelRowProps) => (
  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3">
    <FontAwesomeIcon icon={faHotel} className="shrink-0 text-gray-500" />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-900">{hotel.name}</span>
        {hotel.bookingUrl && (
          <a
            href={hotel.bookingUrl.startsWith('http') ? hotel.bookingUrl : `https://${hotel.bookingUrl}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={bookingLabel}
            className="text-blue-500 hover:text-blue-700">
            <FontAwesomeIcon icon={faLink} />
          </a>
        )}
      </div>
      <div className="text-sm text-gray-500">
        {[hotel.city, hotel.country].filter(Boolean).join(', ')}
        {hotel.checkIn || hotel.checkOut
          ? ` · ${formatTripDate(hotel.checkIn)}${hotel.checkOut ? ` – ${formatTripDate(hotel.checkOut)}` : ''}`
          : ''}
      </div>
      {hotel.description && <div className="truncate text-sm text-gray-500">{hotel.description}</div>}
    </div>
    {hotel.totalPrice > 0 && (
      <span className="shrink-0 text-sm font-medium text-gray-700">
        {formatTripCost(hotel.totalPrice, hotel.currency)}
      </span>
    )}
    <TripItemActions onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
  </div>
)

export default HotelRow
