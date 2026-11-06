'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faListCheck, faNoteSticky, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { useAppContext } from '@/context/AppContext'
import { useGuestsContext } from '@/context/GuestsContext'
import { useBudgetContext } from '@/context/BudgetContext'
import { useProvidersContext } from '@/context/ProvidersContext'
import { useGiftsContext } from '@/context/GiftsContext'
import { usePublicNotesContext } from '@/context/PublicNotesContext'
import { getEventDisplayName } from '@/components/AppHeader/helper'
import { getEventTypeDisplayName, hasEventData } from '@/components/Settings/helper'
import { TodoStatus } from '@/types/Todo'
import { LanguageDirection } from '@/types/General'
import { PUBLIC_NOTE_TOOLTIP_HEB, PUBLIC_NOTE_TOOLTIP_ENG, PUBLIC_NOTE_LABELS } from '@/constants/publicNotes'
import Card, { CardVariant } from '@/components/Shared/Card'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'
import PublicNotesModal from '@/components/PublicNotes/PublicNotesModal'
import EventSetupGuide from '@/components/Shared/EventSetupGuide'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import useEventGate from '@/hooks/useEventGate'
import EventCard from './EventCard'
import BudgetCard from './BudgetCard'
import TripsCard from './TripsCard'

const StatValue = ({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean
  children: React.ReactNode
  className: string
}) => (
  <span className={`flex min-h-12 items-center justify-start ${className}`}>
    {isLoading ? <SpinnerLoader size="lg" /> : children}
  </span>
)

const Dashboard = () => {
  const router = useRouter()
  const { eventSettings, todos, languageDirection, isLoadingTodos } = useAppContext()
  const { guests, isLoadingGuests } = useGuestsContext()
  const { totalPrice, totalPaid, totalToBePaid, guestsIncome, estimatedTotal, balance } = useBudgetContext()
  const { isLoadingProviders } = useProvidersContext()
  const { isLoadingGifts } = useGiftsContext()
  const { publicNotes, isLoadingPublicNotes } = usePublicNotesContext()
  const { isResolving } = useEventGate()
  const isLoadingBudget = isLoadingProviders || isLoadingGifts
  const [notesModalOpen, setNotesModalOpen] = useState(false)

  const isHeb = languageDirection === LanguageDirection.HEB

  const totalGuestCount = useMemo(() => guests.reduce((sum, g) => sum + g.quantity, 0), [guests])

  const completedCount = useMemo(() => todos.filter((t) => t.status === TodoStatus.COMPLETED).length, [todos])

  const upcomingTask = useMemo(() => {
    const pending = todos.filter((t) => t.status !== TodoStatus.COMPLETED)
    if (pending.length === 0) return null
    return pending.sort((a, b) => {
      if (a.reminderTimestamp && b.reminderTimestamp) return a.reminderTimestamp - b.reminderTimestamp
      if (a.reminderTimestamp) return -1
      if (b.reminderTimestamp) return 1
      return a.createdAt - b.createdAt
    })[0]
  }, [todos])

  const eventName = getEventDisplayName(eventSettings)
  const eventTypeName = getEventTypeDisplayName(
    eventSettings.eventType,
    languageDirection,
    eventSettings.customEventType
  )
  const showEvent = hasEventData(eventSettings)

  const incomeValue = guestsIncome > 0 ? guestsIncome : estimatedTotal
  const notesLabel = isHeb ? PUBLIC_NOTE_LABELS.HEB.notes : PUBLIC_NOTE_LABELS.ENG.notes

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5" dir={languageDirection}>
        {showEvent ? (
          <EventCard
            typeName={eventTypeName}
            eventName={eventName}
            eventDate={eventSettings.eventDate}
            eventHall={eventSettings.eventHall}
          />
        ) : isResolving ? (
          <Card
            variant={CardVariant.EVENT}
            className="flex h-full min-h-60 items-center justify-center motion-safe:animate-rise md:col-span-8">
            <SpinnerLoader size="md" className="text-blue-600" />
          </Card>
        ) : (
          <EventSetupGuide variant="card" className="h-full motion-safe:animate-rise md:col-span-8" />
        )}

        <Card
          variant={CardVariant.GUESTS}
          onClick={() => router.push('/guests')}
          style={{ animationDelay: '70ms' }}
          className="flex h-full min-h-44 flex-col justify-between text-start motion-safe:animate-rise md:col-span-4">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
            {isHeb ? 'אורחים' : 'Guests'}
          </span>
          <StatValue isLoading={isLoadingGuests} className="text-5xl font-semibold tracking-tight text-blue-600 tabular-nums">
            {totalGuestCount}
          </StatValue>
        </Card>

        <Card
          variant={CardVariant.TASKS}
          onClick={() => router.push('/tasks')}
          style={{ animationDelay: '140ms' }}
          className="flex h-full min-h-44 flex-col gap-4 text-start motion-safe:animate-rise md:col-span-6">
          <span className="flex items-center gap-2 text-sm font-medium text-blue-50">
            <FontAwesomeIcon icon={faListCheck} />
            {isHeb ? 'משימות הושלמו' : 'Tasks completed'}
          </span>
          <StatValue isLoading={isLoadingTodos} className="text-4xl font-semibold tracking-tight text-white tabular-nums md:text-5xl">
            {completedCount}/{todos.length}
          </StatValue>
          {!isLoadingTodos && upcomingTask && (
            <div className="mt-auto rounded-2xl bg-white/15 px-3.5 py-2.5 text-start backdrop-blur-sm">
              <span className="text-xs font-medium text-blue-50">{isHeb ? 'משימה קרובה' : 'Upcoming task'}</span>
              <p className="truncate text-sm font-semibold text-white">{upcomingTask.name}</p>
              <span className="text-xs text-blue-50">
                {moment(upcomingTask.reminderTimestamp).format('DD.MM.YYYY, HH:mm')}
              </span>
            </div>
          )}
        </Card>

        <Card
          variant={CardVariant.NOTES}
          onClick={() => setNotesModalOpen(true)}
          style={{ animationDelay: '210ms' }}
          className="flex h-full min-h-44 flex-col gap-4 text-start motion-safe:animate-rise md:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-indigo-700/80">
              <FontAwesomeIcon icon={faNoteSticky} className="text-indigo-500" />
              {notesLabel}
            </span>
            <Tooltip
              place={isHeb ? TooltipPlace.RIGHT : TooltipPlace.LEFT}
              content={
                <span dir={languageDirection} className="block max-w-[260px] whitespace-pre-line text-start text-xs">
                  {isHeb ? PUBLIC_NOTE_TOOLTIP_HEB : PUBLIC_NOTE_TOOLTIP_ENG}
                </span>
              }
              contentClassName="w-[280px] whitespace-pre-line">
              <FontAwesomeIcon icon={faCircleInfo} className="h-4 w-4 text-indigo-500" />
            </Tooltip>
          </div>
          <StatValue
            isLoading={isLoadingPublicNotes}
            className="text-5xl font-semibold tracking-tight text-indigo-700 tabular-nums">
            {publicNotes.length}
          </StatValue>
        </Card>

        <BudgetCard
          isHebrew={isHeb}
          isLoading={isLoadingBudget}
          income={incomeValue}
          expenses={totalPrice}
          paid={totalPaid}
          remaining={totalToBePaid}
          balance={balance}
          onClick={() => router.push('/budget')}
        />
        <TripsCard isHebrew={isHeb} />
      </div>
      <PublicNotesModal isOpen={notesModalOpen} onClose={() => setNotesModalOpen(false)} />
    </>
  )
}

export default Dashboard
