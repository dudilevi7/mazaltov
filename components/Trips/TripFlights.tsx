'use client'

import { useState } from 'react'
import type { Flight } from '@/types/Trip'
import { useTripsContext } from '@/context/TripsContext'
import DeleteModal from '@/components/DeleteModal'
import { getTripCopy, TRIP_SECTION_META } from '@/constants/trips'
import {
  getOutboundForReturn,
  getPairedReturn,
  linkedFlightIds,
  newNestedId,
  sortFlightsByDateAsc,
} from './helper'
import { filterFlightsByLocation, sumAmounts } from './tripLocations'
import FlightRow from './FlightRow'
import FlightModal, { type FlightFormResult } from './FlightModal'
import TripSection, { sectionTitle, type TripSliceProps } from './TripSection'

const TripFlights = ({ trip, location, emptyMessage, isRtl, existingPlaces }: TripSliceProps) => {
  const { updateTrip } = useTripsContext()
  const copy = getTripCopy(isRtl)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Flight | null>(null)
  const [pairedReturn, setPairedReturn] = useState<Flight | null>(null)
  const [toDelete, setToDelete] = useState<Flight | null>(null)
  const [groupedIds, setGroupedIds] = useState<Set<string>>(() => new Set())

  const flights = sortFlightsByDateAsc(location ? filterFlightsByLocation(trip.flights, location) : trip.flights)
  const groupedReturnIds = new Set(
    flights.filter((flight) => !flight.isReturn && flight.returnFlightId && groupedIds.has(flight.id)).map((flight) => flight.returnFlightId as string)
  )

  const openEditor = (flight: Flight) => {
    const outbound = flight.isReturn ? getOutboundForReturn(trip.flights, flight) ?? flight : flight
    setEditing(outbound)
    setPairedReturn(getPairedReturn(trip.flights, outbound) ?? null)
    setOpen(true)
  }

  const handleSave = (result: FlightFormResult) => {
    const outboundId = editing?.isReturn
      ? (getOutboundForReturn(trip.flights, editing)?.id ?? editing.id)
      : (editing?.id ?? newNestedId())
    const existingReturnId = editing ? (editing.isReturn ? editing.id : editing.returnFlightId) : undefined
    const returnId = result.returnFlight ? existingReturnId ?? newNestedId() : undefined
    const outbound: Flight = { ...result.outbound, id: outboundId, isReturn: false, returnFlightId: returnId, price: result.outbound.price }
    const returnLeg = result.returnFlight
      ? { ...result.returnFlight, id: returnId as string, isReturn: true, price: 0, returnFlightId: outboundId }
      : undefined
    const replaceIds = linkedFlightIds(trip.flights, outboundId)
    if (existingReturnId) replaceIds.add(existingReturnId)
    const rest = trip.flights.filter((flight) => !replaceIds.has(flight.id))
    updateTrip(trip.id, { flights: returnLeg ? [...rest, outbound, returnLeg] : [...rest, outbound] })
    setOpen(false)
    setEditing(null)
    setPairedReturn(null)
  }

  const toggleGroup = (outboundId: string) => {
    setGroupedIds((prev) => {
      const next = new Set(prev)
      if (next.has(outboundId)) next.delete(outboundId)
      else next.add(outboundId)
      return next
    })
  }

  return (
    <>
      <TripSection
        icon={TRIP_SECTION_META.flights.icon}
        title={sectionTitle('flights', isRtl)}
        count={flights.length}
        totals={sumAmounts(flights.filter((flight) => !flight.isReturn).map((flight) => ({ amount: flight.price, currency: flight.currency })))}
        emptyMessage={emptyMessage}
        onAdd={() => {
          setEditing(null)
          setPairedReturn(null)
          setOpen(true)
        }}
        addLabel={copy.addFlight}>
        <div className="flex flex-col">
          {flights.map((flight) => {
            const paired = !flight.isReturn ? getPairedReturn(trip.flights, flight) : undefined
            const isGrouped = !!(paired && groupedIds.has(flight.id))
            const hidden = flight.isReturn && groupedReturnIds.has(flight.id)
            return (
              <div
                key={flight.id}
                className={`grid transition-[grid-template-rows,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden ? 'mb-0 grid-rows-[0fr]' : 'mb-2 grid-rows-[1fr] last:mb-0'}`}>
                <div
                  className={`min-h-0 overflow-hidden transition-all duration-300 ${hidden ? 'pointer-events-none -translate-y-1 opacity-0' : 'translate-y-0 opacity-100'}`}
                  aria-hidden={hidden}>
                  <FlightRow
                    flight={flight}
                    pairedReturn={paired}
                    isGrouped={isGrouped}
                    onToggleGroup={paired ? () => toggleGroup(flight.id) : undefined}
                    editLabel={copy.edit}
                    deleteLabel={copy.delete}
                    onEdit={() => openEditor(flight)}
                    onDelete={() => setToDelete(flight)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </TripSection>
      {open && (
        <FlightModal
          isOpen={open}
          onClose={() => {
            setOpen(false)
            setEditing(null)
            setPairedReturn(null)
          }}
          onSave={handleSave}
          flight={editing}
          pairedReturn={pairedReturn}
          existingPlaces={existingPlaces}
          isRtl={isRtl}
        />
      )}
      <DeleteModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return
          const ids = linkedFlightIds(trip.flights, toDelete.id)
          updateTrip(trip.id, { flights: trip.flights.filter((flight) => !ids.has(flight.id)) })
          setToDelete(null)
        }}
        title={toDelete?.flightCompany || copy.addFlight}
      />
    </>
  )
}

export default TripFlights
