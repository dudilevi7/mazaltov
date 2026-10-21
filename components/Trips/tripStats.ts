import { AdditionalCostType, TripCurrency } from '@/types/Trip'
import type { Trip } from '@/types/Trip'
import { locationKey, type CurrencyTotals } from './helper'
import { collectTripLocations, countryLabel } from './tripLocations'

export const STATS_CURRENCY_ORDER: TripCurrency[] = [TripCurrency.ILS, TripCurrency.USD, TripCurrency.EUR]

export type ExpenseKey = 'flights' | 'hotels' | 'attractions' | AdditionalCostType

export const EXPENSE_KEYS: ExpenseKey[] = [
  'flights',
  'hotels',
  'attractions',
  AdditionalCostType.FOOD,
  AdditionalCostType.TRANSITIONS,
  AdditionalCostType.SHOPPING,
  AdditionalCostType.COMMUNICATION,
  AdditionalCostType.OTHER,
]

export const EXPENSE_COLORS: Record<ExpenseKey, string> = {
  flights: '#3b82f6',
  hotels: '#8b5cf6',
  attractions: '#f59e0b',
  [AdditionalCostType.FOOD]: '#f97316',
  [AdditionalCostType.TRANSITIONS]: '#eab308',
  [AdditionalCostType.SHOPPING]: '#a855f7',
  [AdditionalCostType.COMMUNICATION]: '#ef4444',
  [AdditionalCostType.OTHER]: '#64748b',
}

export const COUNTRY_BAR_COLORS = [
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#f59e0b',
  '#14b8a6',
  '#f43f5e',
  '#64748b',
]

export interface CountryBar {
  id: string
  code?: string
  label: string
  amount: number
}

export interface CategorySlice {
  key: ExpenseKey
  amount: number
}

const ISO_CODE = /^[a-z]{2}$/

const locationCountryLookup = (trip: Trip, locale: string): Map<string, string> => {
  const lookup = new Map<string, string>()
  collectTripLocations(trip, locale).forEach((location) => {
    if (location.countryCode && ISO_CODE.test(location.countryCode))
      lookup.set(locationKey(location.name), location.countryCode)
  })
  return lookup
}

const countryBucket = (
  lookup: Map<string, string>,
  code: string | undefined,
  countryName: string | undefined,
  places: Array<string | undefined>
): { id: string; code?: string; fallback: string } => {
  const direct = code?.trim().toLowerCase() ?? ''
  if (ISO_CODE.test(direct)) return { id: direct, code: direct, fallback: '' }
  for (const place of [countryName, ...places]) {
    const found = lookup.get(locationKey(place ?? ''))
    if (found && ISO_CODE.test(found)) return { id: found, code: found, fallback: '' }
  }
  const named = (countryName ?? '').trim()
  if (named) return { id: `name:${locationKey(named)}`, fallback: named }
  return { id: 'unknown', fallback: '' }
}

export const currenciesInTotals = (totals: CurrencyTotals): TripCurrency[] =>
  STATS_CURRENCY_ORDER.filter((currency) => (totals[currency] ?? 0) > 0)

export const costsByCountry = (
  trip: Trip,
  currency: TripCurrency,
  locale: string,
  unknownLabel: string
): CountryBar[] => {
  const lookup = locationCountryLookup(trip, locale)
  const buckets = new Map<string, CountryBar>()

  const add = (
    amount: number,
    itemCurrency: TripCurrency,
    code: string | undefined,
    countryName: string | undefined,
    places: Array<string | undefined>
  ) => {
    if (!amount || itemCurrency !== currency) return
    const bucket = countryBucket(lookup, code, countryName, places)
    const existing = buckets.get(bucket.id)
    if (existing) {
      existing.amount += amount
      return
    }
    const label = (bucket.code ? countryLabel(bucket.code, locale) : bucket.fallback) || unknownLabel
    buckets.set(bucket.id, { id: bucket.id, code: bucket.code, label, amount })
  }

  trip.hotels.forEach((hotel) => {
    add(hotel.totalPrice, hotel.currency, hotel.countryCode, hotel.country, [hotel.city])
  })
  ;(trip.attractions ?? []).forEach((attraction) => {
    add(attraction.price, attraction.currency, attraction.countryCode, undefined, [attraction.location])
  })
  ;(trip.additionalCosts ?? []).forEach((cost) => {
    add(cost.price, cost.currency, cost.countryCode, undefined, [cost.location])
  })

  return [...buckets.values()].sort((a, b) => b.amount - a.amount || a.label.localeCompare(b.label, locale))
}

export const costsByCategory = (trip: Trip, currency: TripCurrency): CategorySlice[] => {
  const totals = new Map<ExpenseKey, number>()
  const add = (key: ExpenseKey, amount: number, itemCurrency: TripCurrency) => {
    if (!amount || itemCurrency !== currency) return
    totals.set(key, (totals.get(key) ?? 0) + amount)
  }

  trip.flights.forEach((flight) => {
    if (flight.isReturn) return
    add('flights', flight.price, flight.currency)
  })
  trip.hotels.forEach((hotel) => add('hotels', hotel.totalPrice, hotel.currency))
  ;(trip.attractions ?? []).forEach((attraction) => add('attractions', attraction.price, attraction.currency))
  ;(trip.additionalCosts ?? []).forEach((cost) =>
    add(cost.costType ?? AdditionalCostType.OTHER, cost.price, cost.currency)
  )

  return EXPENSE_KEYS.filter((key) => (totals.get(key) ?? 0) > 0).map((key) => ({ key, amount: totals.get(key) ?? 0 }))
}
