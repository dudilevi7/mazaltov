import { TripCurrency } from '@/types/Trip'
import type { AdditionalCost, Flight, Hotel, Trip, TripLocation } from '@/types/Trip'
import { linkedFlightIds, locationKey, matchesLocation, type CurrencyTotals } from './helper'

export const collectTripLocations = (trip: Trip, locale = 'en'): TripLocation[] => {
  const seen = new Map<string, TripLocation>()
  const add = (raw?: string, countryCode?: string) => {
    const trimmed = (raw ?? '').trim()
    if (!trimmed) return
    const key = locationKey(trimmed)
    const existing = seen.get(key)
    const code = countryCode?.trim().toLowerCase()
    if (!existing) seen.set(key, { name: trimmed, countryCode: code || undefined })
    else if (!existing.countryCode && code) existing.countryCode = code
  }

  trip.flights.forEach((flight) => {
    add(flight.source, flight.sourceCountryCode)
    add(flight.destination, flight.destinationCountryCode)
  })
  trip.hotels.forEach((hotel) => {
    add(hotel.city, hotel.countryCode)
    add(hotel.country, hotel.countryCode)
  })
  ;(trip.additionalCosts ?? []).forEach((cost) => add(cost.location, cost.countryCode))

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: 'base' }))
}

export const filterFlightsByLocation = (flights: Flight[], location: string): Flight[] => {
  if (!location.trim()) return flights
  const ids = new Set<string>()
  flights.forEach((flight) => {
    if (matchesLocation([flight.source, flight.destination], location)) {
      linkedFlightIds(flights, flight.id).forEach((id) => ids.add(id))
    }
  })
  return flights.filter((flight) => ids.has(flight.id))
}

export const filterHotelsByLocation = (hotels: Hotel[], location: string): Hotel[] =>
  location.trim() ? hotels.filter((hotel) => matchesLocation([hotel.city, hotel.country], location)) : hotels

export const filterAdditionalCostsByLocation = (costs: AdditionalCost[], location: string): AdditionalCost[] =>
  location.trim() ? costs.filter((cost) => matchesLocation([cost.location], location)) : costs

export const sumAmounts = (entries: { amount: number; currency: TripCurrency }[]): CurrencyTotals => {
  const totals: CurrencyTotals = {}
  entries.forEach(({ amount, currency }) => {
    if (!amount) return
    totals[currency] = (totals[currency] ?? 0) + amount
  })
  return totals
}

export const computeTripTotals = (trip: Trip, location = ''): CurrencyTotals => {
  const loc = location.trim()
  const totals: CurrencyTotals = {}
  const add = (amount: number, currency: TripCurrency) => {
    if (!amount) return
    totals[currency] = (totals[currency] ?? 0) + amount
  }
  const flights = loc ? filterFlightsByLocation(trip.flights, loc) : trip.flights
  flights.forEach((flight) => {
    if (flight.isReturn) return
    add(flight.price, flight.currency)
  })
  const hotels = loc ? filterHotelsByLocation(trip.hotels, loc) : trip.hotels
  hotels.forEach((hotel) => add(hotel.totalPrice, hotel.currency))
  if (!loc) trip.attractions.forEach((attraction) => add(attraction.price, attraction.currency))
  const costs = loc ? filterAdditionalCostsByLocation(trip.additionalCosts ?? [], loc) : (trip.additionalCosts ?? [])
  costs.forEach((cost) => add(cost.price, cost.currency))
  return totals
}
