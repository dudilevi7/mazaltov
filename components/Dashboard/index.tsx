'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRing,
  faStar,
  faBaby,
  faCalendarDays,
  faUsers,
  faListCheck,
  faCoins,
  faLocationDot,
  faGear,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import moment from 'moment'
import { useAppContext } from '@/context/AppContext'
import { useGuestsContext } from '@/context/GuestsContext'
import { useBudgetContext } from '@/context/BudgetContext'
import { getEventDisplayName } from '@/components/AppHeader/helper'
import { getEventTypeDisplayName, hasEventData } from '@/components/Settings/helper'
import { EventType } from '@/types/Settings'
import { TodoStatus } from '@/types/Todo'
import { LanguageDirection } from '@/types/General'
import { formatCurrency } from '@/lib/utils'
import ProgressBar from '@/components/Shared/ProgressBar'

const EVENT_TYPE_ICON: Record<EventType, IconDefinition> = {
  [EventType.WEDDING]: faRing,
  [EventType.BAR_MITZVA]: faStar,
  [EventType.BRIT]: faBaby,
  [EventType.CUSTOM]: faCalendarDays,
}

const Dashboard = () => {
  const router = useRouter()
  const { eventSettings, todos, languageDirection } = useAppContext()
  const { guests } = useGuestsContext()
  const { totalPrice, totalPaid, totalToBePaid, guestsIncome, estimatedTotal, balance } = useBudgetContext()

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

  const eventIcon = EVENT_TYPE_ICON[eventSettings.eventType] || faCalendarDays
  const eventName = getEventDisplayName(eventSettings)
  const eventTypeName = getEventTypeDisplayName(
    eventSettings.eventType,
    languageDirection,
    eventSettings.customEventType
  )
  const showEvent = hasEventData(eventSettings)

  const incomeValue = guestsIncome > 0 ? guestsIncome : estimatedTotal

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-0.5 p-2" dir={languageDirection}>
      <div className="rounded-lg bg-gray-50 p-6 flex flex-col items-start gap-3 h-full transition-all border border-gray-200">
        {showEvent ? (
          <>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-0.5">
              <FontAwesomeIcon icon={eventIcon} className="text-blue-500 text-2xl" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800">
                  {eventTypeName}
                  {eventTypeName && eventName ? ' - ' : ''}
                  {eventName}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1 text-sm text-gray-800">
              {eventSettings.eventDate && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500 text-xl" />
                  <span className="text-gray-800">{moment(eventSettings.eventDate).format('YYYY | MM | DD')}</span>
                </div>
              )}
              {eventSettings.eventHall && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} className="text-blue-500 text-xl" />
                  <span>{eventSettings.eventHall}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center m-auto justify-center h-full gap-3 text-gray-800">
            <FontAwesomeIcon icon={faGear} className="text-blue-500 text-2xl" />
            <span className="text-sm text-gray-800">
              {isHeb ? 'הגדר פרטי אירוע בהגדרות' : 'Set up event in settings'}
            </span>
          </div>
        )}
      </div>
      <div
        onClick={() => router.push('/guests')}
        className="bg-linear-to-r from-white to-gray-50 rounded-lg p-6 flex flex-col items-center h-full border border-gray-200
           justify-start gap-3 min-h-[180px] cursor-pointer hover:border-blue-400 hover:from-blue-600 hover:to-blue-700 group
           ">
        <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-2xl group-hover:text-white transition-colors " />
        <span className="text-4xl font-bold text-gray-800 group-hover:text-white transition-all ">
          {totalGuestCount}
        </span>
        <span className="text-sm text-gray-500 group-hover:text-white transition-all ">
          {isHeb ? 'אורחים' : 'Guests'}
        </span>
      </div>

      <div
        onClick={() => router.push('/tasks')}
        className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 min-h-[180px] cursor-pointer transition-shadow
         border border-blue-400">
        <FontAwesomeIcon icon={faListCheck} className="text-white text-2xl transition-colors " />
        <span className="text-3xl font-bold text-white transition-all ">
          {completedCount}/{todos.length}
        </span>
        <span className="text-sm text-white transition-all ">{isHeb ? 'משימות הושלמו' : 'Tasks completed'}</span>
        {upcomingTask && (
          <div className="mt-2 w-full bg-blue-800 rounded-lg px-3 py-2 text-center transition-all ">
            <span className="text-xs text-white  font-medium">{isHeb ? 'משימה קרובה' : 'Upcoming task'}:</span>
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-sm text-white font-semibold truncate">{upcomingTask.name}</p>
              <span className="text-xs text-white font-medium">
                {moment(upcomingTask.reminderTimestamp).format('DD.MM.YYYY, HH:mm')}
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => router.push('/budget')}
        className="md:col-span-3 bg-linear-to-r from-white to-gray-50 rounded-lg p-6 flex flex-col gap-4 
        cursor-pointer transition-shadow border border-gray-200 hover:border-blue-400 group">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faCoins} className="text-blue-500 text-xl" />
          <span className="text-lg font-bold text-gray-800">{isHeb ? 'תקציב' : 'Budget'}</span>
        </div>

        <ProgressBar total={totalPrice} completed={totalPaid} remaining={totalToBePaid} />

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">{isHeb ? 'הכנסות' : 'Income'}</span>
            <span className="text-green-600 font-semibold">{formatCurrency(incomeValue)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">{isHeb ? 'הוצאות' : 'Expenses'}</span>
            <span className="text-red-500 font-semibold">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">{isHeb ? 'שולם' : 'Paid'}</span>
            <span className="text-blue-600 font-semibold">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">{isHeb ? 'יתרה' : 'Balance'}</span>
            <span className={`font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
