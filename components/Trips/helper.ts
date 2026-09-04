import { TripCurrency } from '@/types/Trip'
import type { AdditionalCost, Attraction, Flight, Hotel, Trip } from '@/types/Trip'
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

export const computeTripTotals = (trip: Trip): CurrencyTotals => {
  const totals: CurrencyTotals = {}
  const add = (amount: number, currency: TripCurrency) => {
    if (!amount) return
    totals[currency] = (totals[currency] ?? 0) + amount
  }
  trip.flights.forEach((f) => {
    if (f.isReturn) return
    add(f.price, f.currency)
  })
  trip.hotels.forEach((h) => add(h.totalPrice, h.currency))
  trip.attractions.forEach((a) => add(a.price, a.currency))
  ;(trip.additionalCosts ?? []).forEach((c) => add(c.price, c.currency))
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

export const INPUT_CLASS =
  'w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export const emptyFlight = (): Omit<Flight, 'id'> => ({
  flightCompany: '',
  departureAt: '',
  arrivalAt: '',
  connection: '',
  source: '',
  destination: '',
  price: 0,
  currency: TripCurrency.ILS,
  isReturn: false,
})

export const emptyAdditionalCost = (): Omit<AdditionalCost, 'id'> => ({
  name: '',
  date: '',
  description: '',
  price: 0,
  currency: TripCurrency.ILS,
})

export const emptyHotel = (): Omit<Hotel, 'id'> => ({
  name: '',
  bookingUrl: '',
  country: '',
  city: '',
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
