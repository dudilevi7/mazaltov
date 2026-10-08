import { TripCurrency } from '@/types/Trip'
import type { AdditionalCost, Flight, Hotel, Trip, TripLocation } from '@/types/Trip'
import { linkedFlightIds, locationKey, matchesLocation, type CurrencyTotals } from './helper'

const displayNames = new Map<string, Intl.DisplayNames>()

const regionName = (code: string, locale: string): string => {
  const normalized = code.trim().toLowerCase()
  if (!/^[a-z]{2}$/.test(normalized)) return ''
  let names = displayNames.get(locale)
  if (!names) {
    names = new Intl.DisplayNames([locale], { type: 'region' })
    displayNames.set(locale, names)
  }
  const label = names.of(normalized.toUpperCase()) ?? ''
  return label && locationKey(label) !== normalized ? label : ''
}

const countryCodesForLocation = (trip: Trip, location: string): Set<string> => {
  const selected = locationKey(location)
  const codes = new Set<string>()
  if (!selected) return codes
  const consider = (code?: string, countryName?: string) => {
    const normalized = code?.trim().toLowerCase()
    if (!normalized) return
    const aliases = [countryName, regionName(normalized, 'en'), regionName(normalized, 'he')]
    if (aliases.some((name) => name && locationKey(name) === selected)) codes.add(normalized)
  }
  trip.hotels.forEach((hotel) => consider(hotel.countryCode, hotel.country))
  trip.flights.forEach((flight) => {
    consider(flight.sourceCountryCode)
    consider(flight.destinationCountryCode)
  })
  ;(trip.additionalCosts ?? []).forEach((cost) => consider(cost.countryCode))
  return codes
}

const inCountry = (countryCodes: Set<string>, code?: string) => {
  const normalized = code?.trim().toLowerCase()
  return !!normalized && countryCodes.has(normalized)
}

const countryPlaceKeys = (trip: Trip, location: string, countryCodes: Set<string>): Set<string> => {
  const selected = locationKey(location)
  const keys = new Set<string>()
  const add = (name?: string) => {
    const key = locationKey(name ?? '')
    if (key) keys.add(key)
  }
  trip.hotels.forEach((hotel) => {
    if (locationKey(hotel.country) === selected || inCountry(countryCodes, hotel.countryCode)) add(hotel.city)
  })
  trip.flights.forEach((flight) => {
    if (inCountry(countryCodes, flight.sourceCountryCode)) add(flight.source)
    if (inCountry(countryCodes, flight.destinationCountryCode)) add(flight.destination)
  })
  ;(trip.additionalCosts ?? []).forEach((cost) => {
    if (inCountry(countryCodes, cost.countryCode)) add(cost.location)
  })
  return keys
}

const matchesCountryPlace = (countryCodes: Set<string>, placeKeys: Set<string>, name?: string, code?: string) =>
  inCountry(countryCodes, code) || placeKeys.has(locationKey(name ?? ''))

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
    add(regionName(flight.sourceCountryCode ?? '', locale), flight.sourceCountryCode)
    add(regionName(flight.destinationCountryCode ?? '', locale), flight.destinationCountryCode)
  })
  trip.hotels.forEach((hotel) => {
    add(hotel.city, hotel.countryCode)
    add(hotel.country, hotel.countryCode)
    add(regionName(hotel.countryCode ?? '', locale), hotel.countryCode)
  })
  ;(trip.additionalCosts ?? []).forEach((cost) => {
    add(cost.location, cost.countryCode)
    add(regionName(cost.countryCode ?? '', locale), cost.countryCode)
  })

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: 'base' }))
}

export const filterFlightsByLocation = (trip: Trip, location: string): Flight[] => {
  const flights = trip.flights
  if (!location.trim()) return flights
  const countryCodes = countryCodesForLocation(trip, location)
  const placeKeys = countryPlaceKeys(trip, location, countryCodes)
  const ids = new Set<string>()
  flights.forEach((flight) => {
    const named = matchesLocation([flight.source, flight.destination], location)
    const nested =
      matchesCountryPlace(countryCodes, placeKeys, flight.source, flight.sourceCountryCode) ||
      matchesCountryPlace(countryCodes, placeKeys, flight.destination, flight.destinationCountryCode)
    if (named || nested) linkedFlightIds(flights, flight.id).forEach((id) => ids.add(id))
  })
  return flights.filter((flight) => ids.has(flight.id))
}

export const filterHotelsByLocation = (trip: Trip, location: string): Hotel[] => {
  if (!location.trim()) return trip.hotels
  const countryCodes = countryCodesForLocation(trip, location)
  const placeKeys = countryPlaceKeys(trip, location, countryCodes)
  return trip.hotels.filter(
    (hotel) =>
      matchesLocation([hotel.city, hotel.country], location) ||
      matchesCountryPlace(countryCodes, placeKeys, hotel.city, hotel.countryCode) ||
      matchesCountryPlace(countryCodes, placeKeys, hotel.country, hotel.countryCode)
  )
}

export const filterAdditionalCostsByLocation = (trip: Trip, location: string): AdditionalCost[] => {
  const costs = trip.additionalCosts ?? []
  if (!location.trim()) return costs
  const countryCodes = countryCodesForLocation(trip, location)
  const placeKeys = countryPlaceKeys(trip, location, countryCodes)
  return costs.filter((cost) => matchesLocation([cost.location], location) || matchesCountryPlace(countryCodes, placeKeys, cost.location, cost.countryCode))
}

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
  const flights = loc ? filterFlightsByLocation(trip, loc) : trip.flights
  flights.forEach((flight) => {
    if (flight.isReturn) return
    add(flight.price, flight.currency)
  })
  const hotels = loc ? filterHotelsByLocation(trip, loc) : trip.hotels
  hotels.forEach((hotel) => add(hotel.totalPrice, hotel.currency))
  if (!loc) trip.attractions.forEach((attraction) => add(attraction.price, attraction.currency))
  const costs = loc ? filterAdditionalCostsByLocation(trip, loc) : (trip.additionalCosts ?? [])
  costs.forEach((cost) => add(cost.price, cost.currency))
  return totals
}
