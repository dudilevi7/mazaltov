'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PlaceSuggestion, Trip } from '@/types/Trip'
import { LanguageDirection } from '@/types/General'
import { useAppContext } from '@/context/AppContext'
import { getTripCopy } from '@/constants/trips'
import { ALL_LOCATIONS, locationKey } from './helper'
import { collectTripLocations, computeTripTotals } from './tripLocations'
import { flagEmoji } from './PlaceFlag'
import TripDetailHeader from './TripDetailHeader'
import TripFlights from './TripFlights'
import TripHotels from './TripHotels'
import TripAttractions from './TripAttractions'
import TripCosts from './TripCosts'
import TripTasks from './TripTasks'

interface TripDetailProps {
  trip: Trip
  onBack: () => void
  onEditTrip: () => void
  onDeleteTrip: () => void
}

const TripDetail = ({ trip, onBack, onEditTrip, onDeleteTrip }: TripDetailProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const [locationFilter, setLocationFilter] = useState(ALL_LOCATIONS)

  const locations = useMemo(() => collectTripLocations(trip, isRtl ? 'he' : 'en'), [trip, isRtl])
  const locationOptions = useMemo(
    () => locations.map((location) => ({ value: location.name, label: [flagEmoji(location.countryCode), location.name].filter(Boolean).join(' ') })),
    [locations]
  )
  const existingPlaces = useMemo<PlaceSuggestion[]>(
    () =>
      locations.map((location) => ({
        id: `local-${locationKey(location.name)}`,
        name: location.name,
        country: '',
        countryCode: location.countryCode ?? '',
        label: location.name,
      })),
    [locations]
  )

  useEffect(() => {
    if (locationFilter === ALL_LOCATIONS) return
    const canonical = locations.find((location) => locationKey(location.name) === locationKey(locationFilter))
    if (!canonical) setLocationFilter(ALL_LOCATIONS)
    else if (canonical.name !== locationFilter) setLocationFilter(canonical.name)
  }, [locations, locationFilter])

  const selectedLocation = locationFilter === ALL_LOCATIONS ? '' : locationFilter
  const totals = computeTripTotals(trip, selectedLocation)
  const slice = {
    trip,
    location: selectedLocation,
    emptyMessage: selectedLocation ? copy.emptyFilteredSection : undefined,
    isRtl,
    existingPlaces,
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-0.5" dir={languageDirection}>
      <TripDetailHeader
        trip={trip}
        isRtl={isRtl}
        totals={totals}
        totalsLabel={selectedLocation ? `${copy.totalCost} · ${locationFilter}` : copy.totalCost}
        locations={locations.map((location) => location.name)}
        locationFilter={locationFilter}
        locationOptions={locationOptions}
        onLocationChange={setLocationFilter}
        onBack={onBack}
        onEditTrip={onEditTrip}
        onDeleteTrip={onDeleteTrip}
      />
      <TripFlights {...slice} />
      <TripHotels {...slice} />
      {!selectedLocation && <TripAttractions trip={trip} isRtl={isRtl} />}
      <TripCosts {...slice} />
      <TripTasks trip={trip} isRtl={isRtl} />
    </div>
  )
}

export default TripDetail
