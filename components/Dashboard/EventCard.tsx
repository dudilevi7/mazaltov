import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import Card, { CardVariant } from '@/components/Shared/Card'

interface EventCardProps {
  typeName: string
  eventName: string
  eventDate?: string
  eventHall?: string
}

const EventCard = ({ typeName, eventName, eventDate, eventHall }: EventCardProps) => (
  <Card variant={CardVariant.EVENT} className="flex h-full min-h-60 flex-col gap-8 text-start motion-safe:animate-rise md:col-span-8">
    <div className="flex flex-col items-start gap-3">
      {typeName && (
        <span className="inline-flex rounded-full bg-linear-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {typeName}
        </span>
      )}
      {eventName && <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{eventName}</h2>}
    </div>
    {(eventDate || eventHall) && (
      <div className="mt-auto flex flex-col gap-2.5 text-sm text-slate-700">
        {eventDate && (
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarDays} className="text-base text-blue-600" />
            <span>{moment(eventDate).format('YYYY | MM | DD')}</span>
          </p>
        )}
        {eventHall && (
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="text-base text-blue-600" />
            <span className="break-words">{eventHall}</span>
          </p>
        )}
      </div>
    )}
  </Card>
)

export default EventCard
