import { TripCurrency, AdditionalCostType } from '@/types/Trip'
import type { AdditionalCost, Attraction, Flight, Hotel, Trip, TripLocation } from '@/types/Trip'
import moment from 'moment'

export const newNestedId = () => crypto.randomUUID()

export const formatTripCost = (amount: number, currency: TripCurrency): string =>
  new Intl.NumberFormat('he-IL', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0)

export const formatTripDateTime = (value: string): string => {
  if (!value) return ''
  const m = moment(value)
  return m.isValid() ? m.format('DD/MM/YYYY HH:mm') : value
}

export const formatTripDate = (value: string): string => {
  if (!value) return ''
  const m = moment(value)
  return m.isValid() ? m.format('DD/MM/YYYY') : value
}

export const toDateTimeLocal = (value: string): string => {
  if (!value) return ''
  const m = moment(value)
  return m.isValid() ? m.format('YYYY-MM-DDTHH:mm') : value.slice(0, 16)
}

export type CurrencyTotals = Partial<Record<TripCurrency, number>>

export const ALL_LOCATIONS = 'all'

export const locationKey = (value: string): string => value.trim().toLocaleLowerCase()

export const matchesLocation = (fields: Array<string | undefined>, location: string): boolean => {
  const key = locationKey(location)
  if (!key) return true
  return fields.some((field) => locationKey(field ?? '') === key)
}

export const getPairedReturn = (flights: Flight[], outbound: Flight): Flight | undefined =>
  outbound.returnFlightId ? flights.find((f) => f.id === outbound.returnFlightId) : undefined

export const getOutboundForReturn = (flights: Flight[], returnFlight: Flight): Flight | undefined =>
  flights.find((f) => f.returnFlightId === returnFlight.id)

export const linkedFlightIds = (flights: Flight[], flightId: string): Set<string> => {
  const ids = new Set<string>([flightId])
  const flight = flights.find((f) => f.id === flightId)
  if (flight?.returnFlightId) ids.add(flight.returnFlightId)
  flights.filter((f) => f.returnFlightId === flightId).forEach((f) => ids.add(f.id))
  return ids
}

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

  trip.flights.forEach((f) => {
    add(f.source, f.sourceCountryCode)
    add(f.destination, f.destinationCountryCode)
  })
  trip.hotels.forEach((h) => {
    add(h.city, h.countryCode)
    add(h.country, h.countryCode)
  })
  ;(trip.additionalCosts ?? []).forEach((c) => add(c.location, c.countryCode))

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: 'base' }))
}

export const filterFlightsByLocation = (flights: Flight[], location: string): Flight[] => {
  if (!location.trim()) return flights
  const ids = new Set<string>()
  flights.forEach((f) => {
    if (matchesLocation([f.source, f.destination], location)) {
      linkedFlightIds(flights, f.id).forEach((id) => ids.add(id))
    }
  })
  return flights.filter((f) => ids.has(f.id))
}

export const filterHotelsByLocation = (hotels: Hotel[], location: string): Hotel[] =>
  location.trim() ? hotels.filter((h) => matchesLocation([h.city, h.country], location)) : hotels

export const filterAdditionalCostsByLocation = (costs: AdditionalCost[], location: string): AdditionalCost[] =>
  location.trim() ? costs.filter((c) => matchesLocation([c.location], location)) : costs

export const computeTripTotals = (trip: Trip, location = ''): CurrencyTotals => {
  const loc = location.trim()
  const totals: CurrencyTotals = {}
  const add = (amount: number, currency: TripCurrency) => {
    if (!amount) return
    totals[currency] = (totals[currency] ?? 0) + amount
  }
  const flights = loc ? filterFlightsByLocation(trip.flights, loc) : trip.flights
  flights.forEach((f) => {
    if (f.isReturn) return
    add(f.price, f.currency)
  })
  const hotels = loc ? filterHotelsByLocation(trip.hotels, loc) : trip.hotels
  hotels.forEach((h) => add(h.totalPrice, h.currency))
  if (!loc) {
    trip.attractions.forEach((a) => add(a.price, a.currency))
  }
  const costs = loc
    ? filterAdditionalCostsByLocation(trip.additionalCosts ?? [], loc)
    : (trip.additionalCosts ?? [])
  costs.forEach((c) => add(c.price, c.currency))
  return totals
}

export const hasAnyCost = (totals: CurrencyTotals) => Object.values(totals).some((v) => (v ?? 0) > 0)

const toTime = (value: string): number => {
  if (!value) return 0
  const m = moment(value)
  return m.isValid() ? m.valueOf() : 0
}

export const computeTripDateRange = (trip: Trip): { start: string; end: string } | null => {
  const departures: number[] = []
  const arrivals: number[] = []

  trip.flights.forEach((f) => {
    const dep = toTime(f.departureAt)
    const arr = toTime(f.arrivalAt)
    if (dep) departures.push(dep)
    if (arr) arrivals.push(arr)
    else if (dep) arrivals.push(dep)
  })

  if (departures.length === 0) {
    trip.hotels.forEach((h) => {
      const inn = toTime(h.checkIn)
      const out = toTime(h.checkOut)
      if (inn) departures.push(inn)
      if (out) arrivals.push(out)
      else if (inn) arrivals.push(inn)
    })
    trip.attractions.forEach((a) => {
      const d = toTime(a.date)
      if (d) {
        departures.push(d)
        arrivals.push(d)
      }
    })
  }

  if (departures.length === 0) return null
  const start = Math.min(...departures)
  const end = arrivals.length ? Math.max(...arrivals) : Math.max(...departures)
  return {
    start: moment(start).format('DD/MM/YYYY'),
    end: moment(end).format('DD/MM/YYYY'),
  }
}

export const sortFlightsByDateAsc = (flights: Flight[]) =>
  [...flights].sort((a, b) => toTime(a.departureAt) - toTime(b.departureAt))

export const sortHotelsByDateAsc = (hotels: Hotel[]) =>
  [...hotels].sort((a, b) => toTime(a.checkIn || a.checkOut) - toTime(b.checkIn || b.checkOut))

export const sortAttractionsByDateAsc = (attractions: Attraction[]) =>
  [...attractions].sort((a, b) => toTime(a.date) - toTime(b.date))

export const sortAdditionalCostsByDateAsc = (costs: AdditionalCost[]) =>
  [...costs].sort((a, b) => toTime(a.date) - toTime(b.date))

export const INPUT_CLASS =
  'w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export const emptyFlight = (): Omit<Flight, 'id'> => ({
  flightCompany: '',
  departureAt: '',
  arrivalAt: '',
  connection: '',
  source: '',
  destination: '',
  sourceCountryCode: '',
  destinationCountryCode: '',
  price: 0,
  currency: TripCurrency.ILS,
  isReturn: false,
})

export const emptyAdditionalCost = (): Omit<AdditionalCost, 'id'> => ({
  name: '',
  date: '',
  description: '',
  location: '',
  countryCode: '',
  costType: AdditionalCostType.OTHER,
  price: 0,
  currency: TripCurrency.ILS,
})

export const emptyHotel = (): Omit<Hotel, 'id'> => ({
  name: '',
  bookingUrl: '',
  country: '',
  city: '',
  countryCode: '',
  checkIn: '',
  checkOut: '',
  description: '',
  totalPrice: 0,
  currency: TripCurrency.ILS,
})

export const emptyAttraction = (): Omit<Attraction, 'id'> => ({
  name: '',
  price: 0,
  currency: TripCurrency.ILS,
  description: '',
  date: '',
})
