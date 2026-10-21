'use client'

import { useState } from 'react'
import type { Attraction } from '@/types/Trip'
import { useTripsContext } from '@/context/TripsContext'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, TRIP_SECTION_META } from '@/constants/trips'
import { newNestedId, sortAttractionsByDateAsc } from './helper'
import { filterAttractionsByLocation, sumAmounts } from './tripLocations'
import AttractionRow from './AttractionRow'
import AttractionModal from './AttractionModal'
import TripSection, { sectionTitle, type TripSliceProps } from './TripSection'

const TripAttractions = ({ trip, location, emptyMessage, isRtl, existingPlaces }: TripSliceProps) => {
  const { updateTrip } = useTripsContext()
  const copy = getTripCopy(isRtl)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Attraction | null>(null)
  const [toDelete, setToDelete] = useState<Attraction | null>(null)
  const attractions = sortAttractionsByDateAsc(location ? filterAttractionsByLocation(trip, location) : (trip.attractions ?? []))

  const handleSave = (attraction: Omit<Attraction, 'id'>) => {
    if (editing) {
      updateTrip(trip.id, {
        attractions: trip.attractions.map((item) => (item.id === editing.id ? { ...attraction, id: item.id } : item)),
      })
    } else {
      updateTrip(trip.id, { attractions: [...trip.attractions, { ...attraction, id: newNestedId() }] })
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <>
      <TripSection
        icon={TRIP_SECTION_META.attractions.icon}
        title={sectionTitle('attractions', isRtl)}
        count={attractions.length}
        totals={sumAmounts(attractions.map((attraction) => ({ amount: attraction.price, currency: attraction.currency })))}
        emptyMessage={emptyMessage}
        onAdd={() => {
          setEditing(null)
          setOpen(true)
        }}
        addLabel={copy.addAttraction}>
        {attractions.map((attraction) => (
          <AttractionRow
            key={attraction.id}
            attraction={attraction}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            onEdit={() => {
              setEditing(attraction)
              setOpen(true)
            }}
            onDelete={() => setToDelete(attraction)}
          />
        ))}
      </TripSection>
      {open && (
        <AttractionModal
          isOpen={open}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
          attraction={editing}
          existingPlaces={existingPlaces}
          isRtl={isRtl}
        />
      )}
      <DeleteModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          updateTrip(trip.id, { attractions: trip.attractions.filter((item) => item.id !== toDelete.id) })
          setToDelete(null)
        }}
        title={toDelete?.name || ''}
      />
    </>
  )
}

export default TripAttractions
