'use client'

import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import { GuestStatus } from '@/types/Guest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser, faCheck, faTimes, faFileExcel, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { useMemo } from 'react'
import { exportGuestsToCsv, getSideOptions, getSideLabels } from './helper'
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
  const { guests } = useGuestsContext()
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
    const csv = exportGuestsToCsv(guests, DISPLAY_COLUMNS)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guests-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-gray-700">
        <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
        <span className="font-medium">סה&quot;כ אורחים:</span>
        <span>{stats.total}</span>
        <span className="border-s-1 border-gray-400 h-5"></span>
      </div>
      <div className="flex items-center gap-3 text-gray-700 text-sm">
        {sideOptions.map((opt) => (
          <div key={opt.value} className="flex items-center gap-1">
            <FontAwesomeIcon icon={opt.value === 'both' ? faUserGroup : faUser} className="text-gray-500" />
            <span>
              {sideLabels[opt.value] ?? opt.label}: {stats.bySide[opt.label] ?? 0}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white text-sm">
        <FontAwesomeIcon icon={faCheck} />
        <span>אישרו הגעה - {stats.accepted}</span>
      </div>
      <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-md text-white text-sm">
        <FontAwesomeIcon icon={faTimes} />
        <span>דחו הגעה - {stats.declined}</span>
      </div>
      <div className="ms-auto" />
      <CustomButton
        size={ButtonSize.SM}
        variant="white"
        onClick={handleDownloadExcel}
        icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
        ייצוא לאקסל
      </CustomButton>
    </div>
  )
}

export default GuestsSummaryBar
