enum TripType {
  HONEYMOON = 'honeymoon',
  BACHELOR = 'bachelor',
  BACHELORETTE = 'bachelorette',
  OTHER = 'other',
}

enum TripCurrency {
  ILS = 'ILS',
  USD = 'USD',
  EUR = 'EUR',
}

interface PlaceSuggestion {
  id: string
  name: string
  country: string
  countryCode: string
  label: string
}

interface TripLocation {
  name: string
  countryCode?: string
}

interface Flight {
  id: string
  flightCompany: string
  departureAt: string
  arrivalAt: string
  connection: string
  source: string
  destination: string
  sourceCountryCode?: string
  destinationCountryCode?: string
  price: number
  currency: TripCurrency
  isReturn: boolean
  returnFlightId?: string
}

interface AdditionalCost {
  id: string
  name: string
  date: string
  description: string
  location?: string
  countryCode?: string
  price: number
  currency: TripCurrency
}

interface Hotel {
  id: string
  name: string
  bookingUrl: string
  country: string
  city: string
  countryCode?: string
  checkIn: string
  checkOut: string
  description: string
  totalPrice: number
  currency: TripCurrency
}

interface Attraction {
  id: string
  name: string
  price: number
  currency: TripCurrency
  description: string
  date: string
}

interface TripTask {
  id: string
  title: string
  isDone: boolean
  isSuggested: boolean
  templateId?: string
}

interface Trip {
  id: number
  name: string
  tripType: TripType
  flights: Flight[]
  hotels: Hotel[]
  attractions: Attraction[]
  tasks: TripTask[]
  additionalCosts: AdditionalCost[]
  createdAt: number
  updatedAt: number
}

export { TripType, TripCurrency }
export type { Trip, Flight, Hotel, Attraction, TripTask, AdditionalCost, PlaceSuggestion, TripLocation }
