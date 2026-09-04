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

interface Flight {
  id: string
  flightCompany: string
  departureAt: string
  arrivalAt: string
  connection: string
  source: string
  destination: string
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
  price: number
  currency: TripCurrency
}

interface Hotel {
  id: string
  name: string
  bookingUrl: string
  country: string
  city: string
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
export type { Trip, Flight, Hotel, Attraction, TripTask, AdditionalCost }
