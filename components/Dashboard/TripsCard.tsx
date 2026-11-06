'use client'

import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { useTripsContext } from '@/context/TripsContext'
import { TRIP_TYPE_META } from '@/constants/trips'
import { computeTripDateRange } from '@/components/Trips/helper'
import { TripType } from '@/types/Trip'
import Card, { CardVariant } from '@/components/Shared/Card'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'

interface TripsCardProps {
  isHebrew: boolean
}

const TILE_TINT: Record<TripType, string> = {
  [TripType.HONEYMOON]: 'bg-sky-50 ring-sky-100',
  [TripType.BACHELOR]: 'bg-slate-100 ring-slate-200',
  [TripType.BACHELORETTE]: 'bg-indigo-50 ring-indigo-100',
  [TripType.OTHER]: 'bg-blue-50 ring-blue-100',
}

const TripsCard = ({ isHebrew }: TripsCardProps) => {
  const router = useRouter()
  const { trips, isLoadingTrips } = useTripsContext()
  const visible = trips.slice(0, 3)

  return (
    <Card
      variant={CardVariant.TRIPS}
      onClick={() => router.push('/trips')}
      style={{ animationDelay: '350ms' }}
      className="flex flex-col gap-4 text-start motion-safe:animate-rise md:col-span-12">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <FontAwesomeIcon icon={faSuitcase} className="text-blue-500" />
          {isHebrew ? 'טיולים' : 'Trips'}
        </p>
        {!isLoadingTrips && trips.length > 3 && (
          <span className="text-xs text-slate-400">{isHebrew ? `עוד ${trips.length - 3}` : `${trips.length - 3} more`}</span>
        )}
      </div>
      {isLoadingTrips ? (
        <div className="flex min-h-16 items-center justify-center">
          <SpinnerLoader size="md" />
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-500">{isHebrew ? 'עדיין אין טיולים' : 'No trips yet'}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-3">
          {visible.map((trip) => {
            const meta = TRIP_TYPE_META[trip.tripType]
            const dates = computeTripDateRange(trip)
            return (
              <li key={trip.id} className={`min-w-0 rounded-2xl px-4 py-3 ring-1 ${TILE_TINT[trip.tripType]}`}>
                <p className="flex min-w-0 items-center gap-2">
                  <FontAwesomeIcon icon={meta.icon} className={`shrink-0 ${meta.color}`} />
                  <span className="truncate text-sm font-semibold text-slate-900">{trip.name}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{isHebrew ? meta.he : meta.en}</p>
                {dates && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500" />
                    {dates.start}
                    {dates.end !== dates.start ? ` – ${dates.end}` : ''}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

export default TripsCard
