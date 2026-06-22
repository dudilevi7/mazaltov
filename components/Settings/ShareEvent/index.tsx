'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareNodes, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { EventMemberStatus } from '@/types/eventMember'

const roleLabel = (role: string, isRtl: boolean) => {
  if (role === 'admin') return isRtl ? 'מנהל' : 'Admin'
  return isRtl ? 'עורך' : 'Editor'
}

const statusLabel = (status: string, isRtl: boolean) => {
  if (status === EventMemberStatus.ACTIVE) {
    return isRtl ? 'פעיל' : 'Active'
  }
  return isRtl ? 'ממתין' : 'Pending'
}

interface ShareEventProps {
  onOpenInvite: () => void
}

const ShareEvent = ({ onOpenInvite }: ShareEventProps) => {
  const {
    languageDirection,
    currentRole,
    accessibleEvents,
    activeEventId,
    setActiveEvent,
    eventMembers,
    fetchEventMembers,
  } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const isAdmin = currentRole === 'admin'

  useEffect(() => {
    if (!activeEventId) {
      return
    }
    fetchEventMembers()
  }, [activeEventId])

  return (
    <section className="self-start w-full rounded-lg bg-white p-4 shadow-sm border border-gray-100 sm:max-w-md">
      <div className="mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faShareNodes} className="text-blue-500" />
        <h2 className="text-base font-semibold text-gray-800">{isRtl ? 'שיתוף אירוע' : 'Share event'}</h2>
      </div>

      {accessibleEvents.length > 1 && (
        <div className="mb-4 flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">{isRtl ? 'אירוע פעיל' : 'Active event'}</label>
          <select
            value={activeEventId ?? ''}
            onChange={(e) => setActiveEvent(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
            {accessibleEvents.map((ev) => (
              <option key={ev.eventId} value={ev.eventId}>
                {(ev.brideName || ev.ownerName || ev.eventType || ev.eventId) +
                  (ev.isOwner ? (isRtl ? ' (שלי)' : ' (mine)') : '')}
              </option>
            ))}
          </select>
        </div>
      )}

      {eventMembers.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {eventMembers.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <span className="truncate text-gray-700">{m.email}</span>
              <span className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">{roleLabel(m.role, isRtl)}</span>
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    m.status === EventMemberStatus.ACTIVE
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                  {statusLabel(m.status, isRtl)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {isAdmin ? (
        <button
          type="button"
          onClick={onOpenInvite}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 cursor-pointer">
          <FontAwesomeIcon icon={faUserPlus} />
          {isRtl ? 'שתף את האירוע למשתמש אחר' : 'Share event with another user'}
        </button>
      ) : (
        <p className="text-sm text-gray-500">
          {isRtl ? 'רק מנהל יכול לשתף את האירוע.' : 'Only an admin can share the event.'}
        </p>
      )}
    </section>
  )
}

export default ShareEvent
