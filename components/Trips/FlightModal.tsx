'use client'

import { useEffect, useState } from 'react'
import type { Flight, PlaceSuggestion } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import CustomCheckbox from '@/components/Shared/CustomCheckbox'
import Modal from '@/components/Shared/Modal'
import { getTripCopy } from '@/constants/trips'
import { emptyFlight } from './helper'
import FlightFields from './FlightFields'

export interface FlightFormResult {
  outbound: Omit<Flight, 'id'>
  returnFlight?: Omit<Flight, 'id'>
}

interface FlightModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (result: FlightFormResult) => void
  flight?: Flight | null
  pairedReturn?: Flight | null
  isRtl: boolean
  existingPlaces?: PlaceSuggestion[]
}

const withoutId = (flight: Flight): Omit<Flight, 'id'> => {
  const { id: _id, ...rest } = flight
  return rest
}

const FlightModal = ({ isOpen, onClose, onSave, flight, pairedReturn, isRtl, existingPlaces = [] }: FlightModalProps) => {
  const copy = getTripCopy(isRtl)
  const isEdit = !!flight
  const [outbound, setOutbound] = useState(emptyFlight())
  const [addReturn, setAddReturn] = useState(false)
  const [returnFlight, setReturnFlight] = useState(emptyFlight())

  useEffect(() => {
    if (!isOpen) return
    if (flight) {
      setOutbound(withoutId(flight))
      if (pairedReturn) {
        setAddReturn(true)
        setReturnFlight(withoutId(pairedReturn))
      } else {
        setAddReturn(false)
        setReturnFlight(emptyFlight())
      }
    } else {
      setOutbound(emptyFlight())
      setAddReturn(false)
      setReturnFlight(emptyFlight())
    }
  }, [isOpen, flight, pairedReturn])

  useEffect(() => {
    if (!addReturn) return
    setReturnFlight((prev) => ({
      ...prev,
      flightCompany: prev.flightCompany || outbound.flightCompany,
      source: outbound.destination,
      destination: outbound.source,
      sourceCountryCode: outbound.destinationCountryCode,
      destinationCountryCode: outbound.sourceCountryCode,
      currency: outbound.currency,
      isReturn: true,
      price: 0,
    }))
  }, [addReturn, outbound.source, outbound.destination, outbound.sourceCountryCode, outbound.destinationCountryCode, outbound.flightCompany, outbound.currency])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      outbound: { ...outbound, isReturn: false, price: outbound.price, returnFlightId: undefined },
      returnFlight: addReturn ? { ...returnFlight, isReturn: true, price: 0 } : undefined,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl text-right" header={isEdit ? copy.editFlight : copy.addFlight}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <FlightFields
          values={outbound}
          onChange={setOutbound}
          copy={copy}
          existingPlaces={existingPlaces}
          showPrice
          priceLabel={addReturn ? copy.roundTripPrice : copy.price}
        />
        <CustomCheckbox checked={addReturn} onChange={setAddReturn} label={copy.addReturn} />
        {addReturn && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">{copy.returnFlight}</h3>
            <FlightFields values={returnFlight} onChange={setReturnFlight} copy={copy} existingPlaces={existingPlaces} sourceReadOnly destReadOnly showPrice={false} />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
            {copy.cancel}
          </CustomButton>
          <CustomButton size={ButtonSize.SM} type="submit">
            {isEdit ? copy.save : copy.addFlight}
          </CustomButton>
        </div>
      </form>
    </Modal>
  )
}

export default FlightModal
