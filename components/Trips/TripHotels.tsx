'use client'

import { useState } from 'react'
import type { Hotel } from '@/types/Trip'
import { useTripsContext } from '@/context/TripsContext'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, TRIP_SECTION_META } from '@/constants/trips'
import { newNestedId, sortHotelsByDateAsc } from './helper'
import { filterHotelsByLocation, sumAmounts } from './tripLocations'
import HotelRow from './HotelRow'
import HotelModal from './HotelModal'
import TripSection, { sectionTitle, type TripSliceProps } from './TripSection'

const TripHotels = ({ trip, location, emptyMessage, isRtl, existingPlaces }: TripSliceProps) => {
  const { updateTrip } = useTripsContext()
  const copy = getTripCopy(isRtl)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Hotel | null>(null)
  const [toDelete, setToDelete] = useState<Hotel | null>(null)
  const hotels = sortHotelsByDateAsc(location ? filterHotelsByLocation(trip.hotels, location) : trip.hotels)

  const handleSave = (hotel: Omit<Hotel, 'id'>) => {
    if (editing) {
      updateTrip(trip.id, { hotels: trip.hotels.map((item) => (item.id === editing.id ? { ...hotel, id: item.id } : item)) })
    } else {
      updateTrip(trip.id, { hotels: [...trip.hotels, { ...hotel, id: newNestedId() }] })
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <>
      <TripSection
        icon={TRIP_SECTION_META.hotels.icon}
        title={sectionTitle('hotels', isRtl)}
        count={hotels.length}
        totals={sumAmounts(hotels.map((hotel) => ({ amount: hotel.totalPrice, currency: hotel.currency })))}
        emptyMessage={emptyMessage}
        onAdd={() => {
          setEditing(null)
          setOpen(true)
        }}
        addLabel={copy.addHotel}>
        {hotels.map((hotel) => (
          <HotelRow
            key={hotel.id}
            hotel={hotel}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            bookingLabel={copy.bookingLink}
            onEdit={() => {
              setEditing(hotel)
              setOpen(true)
            }}
            onDelete={() => setToDelete(hotel)}
          />
        ))}
      </TripSection>
      {open && (
        <HotelModal
          isOpen={open}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
          hotel={editing}
          existingPlaces={existingPlaces}
          isRtl={isRtl}
        />
      )}
      <DeleteModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          updateTrip(trip.id, { hotels: trip.hotels.filter((hotel) => hotel.id !== toDelete.id) })
          setToDelete(null)
        }}
        title={toDelete?.name || ''}
      />
    </>
  )
}

export default TripHotels
