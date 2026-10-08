'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCoins, faFilter, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import type { Trip } from '@/types/Trip'
import { TripCurrency } from '@/types/Trip'
import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import ActionButton, { ActionButtonSize, ActionButtonVariant } from '@/components/Button/action-button'
import SelectDropdown, { type SelectOption } from '@/components/Shared/SelectDropdown'
import { TRIP_TYPE_META, getTripCopy } from '@/constants/trips'
import { ALL_LOCATIONS, formatTripCost, hasAnyCost, type CurrencyTotals } from './helper'

const CURRENCY_ORDER: TripCurrency[] = [TripCurrency.ILS, TripCurrency.USD, TripCurrency.EUR]

interface TripDetailHeaderProps {
  trip: Trip
  isRtl: boolean
  totals: CurrencyTotals
  totalsLabel: string
  locations: string[]
  locationFilter: string
  locationOptions: SelectOption[]
  onLocationChange: (value: string) => void
  onBack: () => void
  onEditTrip: () => void
  onDeleteTrip: () => void
}

const TripDetailHeader = ({
  trip,
  isRtl,
  totals,
  totalsLabel,
  locations,
  locationFilter,
  locationOptions,
  onLocationChange,
  onBack,
  onEditTrip,
  onDeleteTrip,
}: TripDetailHeaderProps) => {
  const { languageDirection } = useAppContext()
  const copy = getTripCopy(isRtl)
  const typeMeta = TRIP_TYPE_META[trip.tripType]

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CustomButton
          variant="white"
          size={ButtonSize.SM}
          onClick={onBack}
          icon={<FontAwesomeIcon icon={languageDirection === LanguageDirection.HEB ? faChevronRight : faChevronLeft} />}>
          {copy.back}
        </CustomButton>
        <div className="flex items-center gap-0.5">
          <ActionButton icon={faPen} variant={ActionButtonVariant.EDIT} size={ActionButtonSize.SM} tooltip={copy.edit} onClick={onEditTrip} />
          <ActionButton icon={faTrash} variant={ActionButtonVariant.DELETE} size={ActionButtonSize.SM} tooltip={copy.delete} onClick={onDeleteTrip} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FontAwesomeIcon icon={typeMeta.icon} className={typeMeta.color} />
        <h1 className="text-lg font-semibold text-gray-800">{trip.name}</h1>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{isRtl ? typeMeta.he : typeMeta.en}</span>
      </div>
      {locations.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" aria-hidden />
          <span className="whitespace-nowrap">{copy.locationFilter}:</span>
          <SelectDropdown
            value={locationFilter}
            onChange={onLocationChange}
            options={[{ value: ALL_LOCATIONS, label: copy.allLocations }, ...locationOptions]}
            placeholder={copy.allLocations}
            className="min-w-32"
            searchable
          />
        </div>
      )}
      {hasAnyCost(totals) && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <FontAwesomeIcon icon={faCoins} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{totalsLabel}</span>
          {CURRENCY_ORDER.map((currency) =>
            totals[currency] ? (
              <span key={currency} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {formatTripCost(totals[currency], currency)}
              </span>
            ) : null
          )}
        </div>
      )}
    </>
  )
}

export default TripDetailHeader
