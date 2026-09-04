import type { AdditionalCost, Attraction, Flight, Hotel, Trip, TripTask } from '@/types/Trip'
import { TripType } from '@/types/Trip'

export type TripRow = {
  id: number | string
  user_id: string
  event_id: string
  name: string
  trip_type: string
  flights: Flight[]
  hotels: Hotel[]
  attractions: Attraction[]
  tasks: TripTask[]
  additional_costs: AdditionalCost[]
  created_at: string
  updated_at: string
}

const asArray = <T>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : [])

const toNum = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === 'string' ? parseInt(v, 10) : v

export const mapTripRowToTrip = (row: TripRow): Trip => ({
  id: toNum(row.id),
  name: row.name ?? '',
  tripType: (row.trip_type ?? TripType.OTHER) as Trip['tripType'],
  flights: asArray(row.flights),
  hotels: asArray(row.hotels),
  attractions: asArray(row.attractions),
  tasks: asArray(row.tasks),
  additionalCosts: asArray(row.additional_costs ?? (row as TripRow & { costs?: AdditionalCost[] }).costs),
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapTripToTripRow = (trip: Partial<Trip>) => {
  const row: Record<string, unknown> = {}
  if (trip.name !== undefined) row.name = trip.name
  if (trip.tripType !== undefined) row.trip_type = trip.tripType
  if (trip.flights !== undefined) row.flights = trip.flights
  if (trip.hotels !== undefined) row.hotels = trip.hotels
  if (trip.attractions !== undefined) row.attractions = trip.attractions
  if (trip.tasks !== undefined) row.tasks = trip.tasks
  if (trip.additionalCosts !== undefined) row.additional_costs = trip.additionalCosts
  return row
}

export const mapTripToTripRowForInsert = (trip: Partial<Trip>) => ({
  name: trip.name ?? '',
  trip_type: trip.tripType ?? TripType.OTHER,
  flights: trip.flights ?? [],
  hotels: trip.hotels ?? [],
  attractions: trip.attractions ?? [],
  tasks: trip.tasks ?? [],
  additional_costs: trip.additionalCosts ?? [],
})

export const TRIP_TYPES = ['honeymoon', 'bachelor', 'bachelorette', 'other'] as const
export const TRIP_CURRENCIES = ['ILS', 'USD', 'EUR'] as const
