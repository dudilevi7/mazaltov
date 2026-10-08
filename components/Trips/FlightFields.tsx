'use client'

import type { Flight, PlaceSuggestion } from '@/types/Trip'
import { TripCurrency } from '@/types/Trip'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import { CURRENCY_OPTIONS, getTripCopy } from '@/constants/trips'
import { INPUT_CLASS, toDateTimeLocal } from './helper'
import LocationAutocomplete from './LocationAutocomplete'

const FlightFields = ({
  values,
  onChange,
  copy,
  existingPlaces = [],
  sourceReadOnly,
  destReadOnly,
  showPrice = true,
  priceLabel,
}: {
  values: Omit<Flight, 'id'>
  onChange: (next: Omit<Flight, 'id'>) => void
  copy: ReturnType<typeof getTripCopy>
  existingPlaces?: PlaceSuggestion[]
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
      <LocationAutocomplete
        value={values.source}
        countryCode={values.sourceCountryCode}
        existingPlaces={existingPlaces}
        disabled={sourceReadOnly}
        required={!sourceReadOnly}
        onChange={({ name, countryCode }) => onChange({ ...values, source: name, sourceCountryCode: countryCode ?? '' })}
      />
    </div>
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{copy.to}</label>
      <LocationAutocomplete
        value={values.destination}
        countryCode={values.destinationCountryCode}
        existingPlaces={existingPlaces}
        disabled={destReadOnly}
        required={!destReadOnly}
        onChange={({ name, countryCode }) =>
          onChange({ ...values, destination: name, destinationCountryCode: countryCode ?? '' })
        }
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
      <input type="text" value={values.connection} onChange={(e) => onChange({ ...values, connection: e.target.value })} className={INPUT_CLASS} />
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

export default FlightFields
