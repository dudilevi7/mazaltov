'use client'

import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import { GuestStatus } from '@/types/Guest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser, faCheck, faTimes, faFileExcel, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { useMemo } from 'react'
import { exportGuestsToExcel, getSideOptions, getSideLabels } from './helper'
import type { Guest } from '@/types/Guest'

const DISPLAY_COLUMNS: { key: keyof Guest; label: string }[] = [
  { key: 'name', label: 'שם' },
  { key: 'quantity', label: 'כמות' },
  { key: 'status', label: 'סטטוס' },
  { key: 'side', label: 'צד' },
  { key: 'table', label: 'שולחן' },
  { key: 'phoneNumber', label: 'טלפון' },
  { key: 'category', label: 'קירבה' },
  { key: 'gift', label: 'מתנה' },
  { key: 'manualApproval', label: 'אישור ידני' },
]

const GuestsSummaryBar = () => {
  const { guests, statusFilter, setStatusFilter } = useGuestsContext()
  const { eventSettings } = useAppContext()

  const sideOptions = useMemo(() => getSideOptions(eventSettings), [eventSettings])
  const sideLabels = useMemo(() => getSideLabels(eventSettings), [eventSettings])

  const stats = useMemo(() => {
    const total = guests.reduce((sum, guest) => sum + guest.quantity, 0)
    const bySide: Record<string, number> = {}
    sideOptions.forEach((opt) => {
      bySide[opt.label] = guests.filter((guest) => guest.side === opt.label).reduce((s, guest) => s + guest.quantity, 0)
    })
    const accepted = guests
      .filter((guest) => guest.status === GuestStatus.ACCEPTED)
      .reduce((s, guest) => s + guest.quantity, 0)
    const declined = guests
      .filter((guest) => guest.status === GuestStatus.DECLINED)
      .reduce((s, guest) => s + guest.quantity, 0)
    return { total, bySide, accepted, declined }
  }, [guests, sideOptions, sideLabels])

  const handleDownloadExcel = () => {
    exportGuestsToExcel(guests, DISPLAY_COLUMNS, sideLabels)
  }

  return (
    <div className="mb-4 flex flex-wrap flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex flex-row items-center gap-2 text-gray-700 border-b border-gray-200 pb-2">
        <div className="flex flex-row items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-lg" />
          <span className="font-medium text-base">סה&quot;כ אורחים</span>
        </div>
        <span className="font-medium text-2xl">{stats.total}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 text-gray-700 text-sm">
          {sideOptions.map((opt, index) => (
            <div key={opt.value} className="flex items-center gap-1">
              <FontAwesomeIcon icon={opt.value === 'both' ? faUserGroup : faUser} className="text-gray-500" />
              <span>
                {sideLabels[opt.value] ?? opt.label} {stats.bySide[opt.label] ?? 0}
              </span>
              {sideOptions.length > 1 && index < sideOptions.length - 1 && (
                <div className="border-r border-gray-200 h-6 w-0.5 ms-2" />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setStatusFilter(statusFilter === GuestStatus.ACCEPTED ? 'all' : GuestStatus.ACCEPTED)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-white text-sm transition-all cursor-pointer hover:shadow-md ${
            statusFilter === GuestStatus.ACCEPTED
              ? 'bg-green-700 ring-1 ring-green-800'
              : 'bg-green-600 hover:bg-green-700'
          }`}>
          <FontAwesomeIcon icon={faCheck} />
          <span>אישרו הגעה - {stats.accepted}</span>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === GuestStatus.DECLINED ? 'all' : GuestStatus.DECLINED)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-white text-sm transition-all cursor-pointer hover:shadow-md ${
            statusFilter === GuestStatus.DECLINED ? 'bg-red-700 ring-1 ring-red-800' : 'bg-red-600 hover:bg-red-700'
          }`}>
          <FontAwesomeIcon icon={faTimes} />
          <span>דחו הגעה - {stats.declined}</span>
        </button>
        <div className="ms-auto" />
        <CustomButton
          size={ButtonSize.SM}
          variant="white"
          onClick={handleDownloadExcel}
          icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
          ייצוא לאקסל
        </CustomButton>
      </div>
    </div>
  )
}

export default GuestsSummaryBar
