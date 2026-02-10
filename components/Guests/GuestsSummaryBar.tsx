'use client'

import { useGuestsContext } from '@/context/GuestsContext'
import { GuestStatus, GuestSide } from '@/types/Guest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser, faCheck, faTimes, faFileExcel, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { useMemo } from 'react'
import { exportGuestsToCsv } from './helper'
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

  const stats = useMemo(() => {
    const total = guests.reduce((sum, g) => sum + g.quantity, 0)
    const bySide = {
      [GuestSide.BRIDE]: guests.filter((g) => g.side === GuestSide.BRIDE).reduce((s, g) => s + g.quantity, 0),
      [GuestSide.GROOM]: guests.filter((g) => g.side === GuestSide.GROOM).reduce((s, g) => s + g.quantity, 0),
      [GuestSide.BOTH]: guests.filter((g) => g.side === GuestSide.BOTH).reduce((s, g) => s + g.quantity, 0),
    }
    const accepted = guests.filter((g) => g.status === GuestStatus.ACCEPTED).reduce((s, g) => s + g.quantity, 0)
    const declined = guests.filter((g) => g.status === GuestStatus.DECLINED).reduce((s, g) => s + g.quantity, 0)
    return { total, bySide, accepted, declined }
  }, [guests])

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
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faUser} className="text-gray-500" />
          <span>כלה: {stats.bySide[GuestSide.BRIDE]}</span>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faUser} className="text-gray-500" />
          <span>חתן: {stats.bySide[GuestSide.GROOM]}</span>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faUserGroup} className="text-gray-500" />
          <span>שניהם: {stats.bySide[GuestSide.BOTH]}</span>
        </div>
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
