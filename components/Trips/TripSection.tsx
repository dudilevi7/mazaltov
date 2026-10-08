'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { TripCurrency } from '@/types/Trip'
import type { PlaceSuggestion, Trip } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import CollapsibleContainer from '@/components/Shared/CollapsibleContainer'
import { TRIP_SECTION_META } from '@/constants/trips'
import { formatTripCost, hasAnyCost, type CurrencyTotals } from './helper'

const CURRENCY_ORDER: TripCurrency[] = [TripCurrency.ILS, TripCurrency.USD, TripCurrency.EUR]

export type TripSliceProps = {
  trip: Trip
  location: string
  emptyMessage?: string
  isRtl: boolean
  existingPlaces: PlaceSuggestion[]
}

export const sectionTitle = (key: keyof typeof TRIP_SECTION_META, isRtl: boolean) =>
  isRtl ? TRIP_SECTION_META[key].he : TRIP_SECTION_META[key].en

const TripSection = ({
  icon,
  title,
  count,
  onAdd,
  addLabel,
  children,
  headerExtra,
  emptyMessage,
  totals,
}: {
  icon: IconDefinition
  title: string
  count: number
  onAdd: () => void
  addLabel: string
  children: React.ReactNode
  headerExtra?: React.ReactNode
  emptyMessage?: string
  totals?: CurrencyTotals
}) => {
  const [isOpen, setIsOpen] = useState(count > 0 || !!emptyMessage)
  const prevCount = useRef(count)

  useEffect(() => {
    if (prevCount.current === 0 && count > 0) setIsOpen(true)
    prevCount.current = count
  }, [count])

  useEffect(() => {
    if (emptyMessage && count === 0) setIsOpen(true)
  }, [emptyMessage, count])

  return (
    <CollapsibleContainer
      count={count}
      open={isOpen}
      onOpenChange={setIsOpen}
      title={
        <>
          <FontAwesomeIcon icon={icon} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </>
      }
      suffix={
        totals && hasAnyCost(totals) ? (
          <span className="flex items-center gap-1">
            {CURRENCY_ORDER.map((currency) =>
              totals[currency] ? (
                <span key={currency} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {formatTripCost(totals[currency], currency)}
                </span>
              ) : null
            )}
          </span>
        ) : null
      }
      actions={
        <CustomButton size={ButtonSize.SM} onClick={onAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
          {addLabel}
        </CustomButton>
      }
      showZeroCount={!!emptyMessage && count === 0}>
      {headerExtra || count > 0 || emptyMessage ? (
        <>
          {headerExtra}
          {count > 0 ? (
            <div className="flex flex-col gap-2">{children}</div>
          ) : emptyMessage ? (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          ) : null}
        </>
      ) : null}
    </CollapsibleContainer>
  )
}

export default TripSection
