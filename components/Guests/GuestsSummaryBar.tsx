'use client'

import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import { GuestStatus } from '@/types/Guest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faUser,
  faCheck,
  faTimes,
  faUserGroup,
  faTrash,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react'
import { getSideOptions, getSideLabels, getDuplicatePhoneGuests } from './helper'
import type { Guest } from '@/types/Guest'
import GuestsExportExcelButton from './ExportExcel/GuestsExportExcelButton'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import DeleteModal from '@/components/DeleteModal'

const DISPLAY_COLUMNS: { key: keyof Guest; label: string }[] = [
  { key: 'name', label: 'שם' },
  { key: 'quantity', label: 'כמות' },
  { key: 'status', label: 'סטטוס' },
  { key: 'side', label: 'צד' },
  { key: 'table', label: 'שולחן' },
  { key: 'phoneNumber', label: 'טלפון' },
  { key: 'category', label: 'קירבה' },
  { key: 'gift', label: 'מתנה' },
  { key: 'notes', label: 'הערות' },
]

const GuestsSummaryBar = () => {
  const { guests, statusFilter, setStatusFilter, clearGuests } = useGuestsContext()
  const { eventSettings } = useAppContext()
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)

  const handleConfirmDeleteAll = async () => {
    await clearGuests()
    setShowDeleteAllModal(false)
  }

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
    const approved = guests.reduce((s, guest) => s + (guest.approved ?? 0), 0)
    return { total, bySide, accepted, declined, approved }
  }, [guests, sideOptions, sideLabels])

  const duplicatePhones = useMemo(() => getDuplicatePhoneGuests(guests), [guests])

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
            statusFilter === GuestStatus.ACCEPTED ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
          }`}>
          <FontAwesomeIcon icon={faCheck} />
          <span>אישרו הגעה - {stats.approved > 0 ? ` ${stats.approved}` : ''}</span>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === GuestStatus.DECLINED ? 'all' : GuestStatus.DECLINED)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-white text-sm transition-all cursor-pointer hover:shadow-md ${
            statusFilter === GuestStatus.DECLINED ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
          }`}>
          <FontAwesomeIcon icon={faTimes} />
          <span>דחו הגעה - {stats.declined}</span>
        </button>
        {duplicatePhones.length > 0 && (
          <Tooltip
            place={TooltipPlace.BOTTOM}
            contentClassName="whitespace-normal w-max max-w-80"
            content={
              <div className="flex flex-col gap-1 whitespace-normal max-w-80 text-right" dir="rtl">
                <span className="font-semibold text-red-300">מספרי טלפון כפולים:</span>
                {duplicatePhones.map((dup) => (
                  <div key={dup.phone} className="text-xs">
                    <span className="text-gray-300">{dup.guests.map((g) => g.name).join(', ')}</span>
                    <span className="text-gray-400 ms-1">({dup.guests[0].phoneNumber})</span>
                  </div>
                ))}
              </div>
            }>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-sm cursor-pointer hover:bg-amber-200 transition-colors">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{duplicatePhones.length} טלפונים כפולים</span>
            </div>
          </Tooltip>
        )}
        <div className="ms-auto" />
        <GuestsExportExcelButton guests={guests} columns={DISPLAY_COLUMNS} sideLabels={sideLabels} />
        <CustomButton
          size={ButtonSize.SM}
          variant="red"
          onClick={() => setShowDeleteAllModal(true)}
          icon={<FontAwesomeIcon icon={faTrash} />}>
          מחק הכל
        </CustomButton>
      </div>
      <DeleteModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={handleConfirmDeleteAll}
        title="כל האורחים"
      />
    </div>
  )
}

export default GuestsSummaryBar
