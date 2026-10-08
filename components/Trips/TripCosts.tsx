'use client'

import { useState } from 'react'
import type { AdditionalCost } from '@/types/Trip'
import { useTripsContext } from '@/context/TripsContext'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, TRIP_SECTION_META } from '@/constants/trips'
import { newNestedId, sortAdditionalCostsByDateAsc } from './helper'
import { filterAdditionalCostsByLocation, sumAmounts } from './tripLocations'
import CostRow from './CostRow'
import CostModal from './CostModal'
import TripSection, { sectionTitle, type TripSliceProps } from './TripSection'

const TripCosts = ({ trip, location, emptyMessage, isRtl, existingPlaces }: TripSliceProps) => {
  const { updateTrip } = useTripsContext()
  const copy = getTripCopy(isRtl)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdditionalCost | null>(null)
  const [toDelete, setToDelete] = useState<AdditionalCost | null>(null)
  const costs = sortAdditionalCostsByDateAsc(
    location ? filterAdditionalCostsByLocation(trip.additionalCosts ?? [], location) : (trip.additionalCosts ?? [])
  )

  const handleSave = (cost: Omit<AdditionalCost, 'id'>) => {
    const additionalCosts = trip.additionalCosts ?? []
    if (editing) {
      updateTrip(trip.id, {
        additionalCosts: additionalCosts.map((item) => (item.id === editing.id ? { ...cost, id: item.id } : item)),
      })
    } else {
      updateTrip(trip.id, { additionalCosts: [...additionalCosts, { ...cost, id: newNestedId() }] })
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <>
      <TripSection
        icon={TRIP_SECTION_META.additionalCosts.icon}
        title={sectionTitle('additionalCosts', isRtl)}
        count={costs.length}
        totals={sumAmounts(costs.map((cost) => ({ amount: cost.price, currency: cost.currency })))}
        emptyMessage={emptyMessage}
        onAdd={() => {
          setEditing(null)
          setOpen(true)
        }}
        addLabel={copy.addCost}>
        {costs.map((cost) => (
          <CostRow
            key={cost.id}
            cost={cost}
            editLabel={copy.edit}
            deleteLabel={copy.delete}
            onEdit={() => {
              setEditing(cost)
              setOpen(true)
            }}
            onDelete={() => setToDelete(cost)}
          />
        ))}
      </TripSection>
      {open && (
        <CostModal
          isOpen={open}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
          cost={editing}
          isRtl={isRtl}
          existingPlaces={existingPlaces}
        />
      )}
      <DeleteModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          updateTrip(trip.id, { additionalCosts: (trip.additionalCosts ?? []).filter((cost) => cost.id !== toDelete.id) })
          setToDelete(null)
        }}
        title={toDelete?.name || ''}
      />
    </>
  )
}

export default TripCosts
