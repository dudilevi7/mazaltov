'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { TripCurrency } from '@/types/Trip'
import { formatTripCost, hasAnyCost, type CurrencyTotals } from './helper'

interface TripCostSummaryProps {
  totals: CurrencyTotals
  label: string
}

const ORDER: TripCurrency[] = [TripCurrency.ILS, TripCurrency.USD, TripCurrency.EUR]

const TripCostSummary = ({ totals, label }: TripCostSummaryProps) => {
  if (!hasAnyCost(totals)) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <FontAwesomeIcon icon={faCoins} className="text-gray-500" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {ORDER.map((currency) => {
        const amount = totals[currency]
        if (!amount) return null
        return (
          <span
            key={currency}
            className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {formatTripCost(amount, currency)}
          </span>
        )
      })}
    </div>
  )
}

export default TripCostSummary
