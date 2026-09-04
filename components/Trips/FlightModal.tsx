'use client'

import { useEffect, useState } from 'react'
import type { Flight } from '@/types/Trip'
import { TripCurrency } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import CustomCheckbox from '@/components/Shared/CustomCheckbox'
import Modal from '@/components/Shared/Modal'
import { CURRENCY_OPTIONS, getTripCopy } from '@/constants/trips'
import { INPUT_CLASS, emptyFlight, toDateTimeLocal } from './helper'

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
}

const FlightFields = ({
  values,
  onChange,
  copy,
  sourceReadOnly,
  destReadOnly,
  showPrice = true,
  priceLabel,
}: {
  values: Omit<Flight, 'id'>
  onChange: (next: Omit<Flight, 'id'>) => void
  copy: ReturnType<typeof getTripCopy>
  sourceReadOnly?: boolean
  destReadOnly?: boolean
  showPrice?: boolean
  priceLabel?: string
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="md:col-span-2">
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.flightCompany}</label>
      <input
        type="text"
        value={values.flightCompany}
        onChange={(e) => onChange({ ...values, flightCompany: e.target.value })}
        required
        className={INPUT_CLASS}
      />
    </div>
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.from}</label>
      <input
        type="text"
        value={values.source}
        onChange={(e) => onChange({ ...values, source: e.target.value })}
        required
        readOnly={sourceReadOnly}
        className={`${INPUT_CLASS} ${sourceReadOnly ? 'bg-gray-100 text-gray-900' : ''}`}
      />
    </div>
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.to}</label>
      <input
        type="text"
        value={values.destination}
        onChange={(e) => onChange({ ...values, destination: e.target.value })}
        required
        readOnly={destReadOnly}
        className={`${INPUT_CLASS} ${destReadOnly ? 'bg-gray-100 text-gray-900' : ''}`}
      />
    </div>
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.departure}</label>
      <input
        type="datetime-local"
        dir="ltr"
        value={toDateTimeLocal(values.departureAt)}
        onChange={(e) => onChange({ ...values, departureAt: e.target.value })}
        required
        className={INPUT_CLASS}
      />
    </div>
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.arrival}</label>
      <input
        type="datetime-local"
        dir="ltr"
        value={toDateTimeLocal(values.arrivalAt)}
        onChange={(e) => onChange({ ...values, arrivalAt: e.target.value })}
        required
        className={INPUT_CLASS}
      />
    </div>
    <div className="md:col-span-2">
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.connection}</label>
      <input
        type="text"
        value={values.connection}
        onChange={(e) => onChange({ ...values, connection: e.target.value })}
        className={INPUT_CLASS}
      />
    </div>
    {showPrice && (
      <>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{priceLabel ?? copy.price}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={values.price || ''}
            onChange={(e) => onChange({ ...values, price: parseFloat(e.target.value) || 0 })}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.currency}</label>
          <SelectDropdown
            value={values.currency}
            onChange={(value) => onChange({ ...values, currency: value as TripCurrency })}
            options={CURRENCY_OPTIONS}
            className="w-full"
          />
        </div>
      </>
    )}
  </div>
)

const withoutId = (flight: Flight): Omit<Flight, 'id'> => {
  const { id: _id, ...rest } = flight
  return rest
}

const FlightModal = ({ isOpen, onClose, onSave, flight, pairedReturn, isRtl }: FlightModalProps) => {
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
      currency: outbound.currency,
      isReturn: true,
      price: 0,
    }))
  }, [addReturn, outbound.source, outbound.destination, outbound.flightCompany, outbound.currency])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      outbound: {
        ...outbound,
        isReturn: false,
        price: outbound.price,
        returnFlightId: undefined,
      },
      returnFlight: addReturn ? { ...returnFlight, isReturn: true, price: 0 } : undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl text-right"
      header={isEdit ? copy.editFlight : copy.addFlight}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <FlightFields
          values={outbound}
          onChange={setOutbound}
          copy={copy}
          showPrice
          priceLabel={addReturn ? copy.roundTripPrice : copy.price}
        />
        <CustomCheckbox checked={addReturn} onChange={setAddReturn} label={copy.addReturn} />
        {addReturn && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">{copy.returnFlight}</h3>
            <FlightFields
              values={returnFlight}
              onChange={setReturnFlight}
              copy={copy}
              sourceReadOnly
              destReadOnly
              showPrice={false}
            />
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
