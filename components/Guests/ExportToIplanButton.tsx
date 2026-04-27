'use client'

import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import { useGuestsContext } from '@/context/GuestsContext'
import { useAppContext } from '@/context/AppContext'
import { exportToIplanTemplate } from './helper'
import { EventType } from '@/types/Settings'

const STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  accepted: 'אישר',
  declined: 'דחה',
  maybe: 'אולי',
}

const IPLAN_EXPORT_INFO = 'תוכלו לייצא לפי סינון - למשל רק אורחים שאישרו הגעה. סננו את הטבלה כרצונכם וחזרו לכאן לייצוא.'

const ExportToIplanButton = () => {
  const {
    filteredGuests,
    hasFiltersOrSearch,
    searchQuery,
    sideFilter,
    statusFilter,
    categoryFilter,
    veganFilter,
    vegetarianFilter,
    glatKosherFilter,
    transportationFilter,
  } = useGuestsContext()
  const { eventSettings } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)

  const totalNumberOfGuests = useMemo(
    () => filteredGuests.reduce((sum, guest) => sum + guest.quantity, 0),
    [filteredGuests]
  )

  const guestSideByName = useMemo(() => {
    if (eventSettings.eventType === EventType.WEDDING && eventSettings.brideName && eventSettings.groomName) {
      return {
        [eventSettings.brideName as string]: 'כלה',
        [eventSettings.groomName as string]: 'חתן',
      }
    }
    return { [eventSettings.ownerName as string]: 'חתן' }
  }, [eventSettings])

  const activeFilterLines = useMemo(() => {
    const lines: string[] = []
    const q = searchQuery.trim()
    if (q) lines.push(`חיפוש: «${q}»`)
    if (sideFilter.value !== 'all') lines.push(`צד: ${sideFilter.label}`)
    if (statusFilter !== 'all') lines.push(`סטטוס: ${STATUS_LABELS[statusFilter] ?? statusFilter}`)
    if (categoryFilter !== 'all') lines.push(`קירבה: ${categoryFilter}`)
    if (veganFilter) lines.push('טבעוני')
    if (vegetarianFilter) lines.push('צמחוני')
    if (glatKosherFilter) lines.push('גלאט כשר')
    if (transportationFilter) lines.push('הסעה')
    return lines
  }, [
    searchQuery,
    sideFilter,
    statusFilter,
    categoryFilter,
    veganFilter,
    vegetarianFilter,
    glatKosherFilter,
    transportationFilter,
  ])

  const handleExport = () => {
    exportToIplanTemplate(filteredGuests, guestSideByName, eventSettings)
    setIsOpen(false)
  }

  return (
    <>
      <CustomButton
        size={ButtonSize.SM}
        className="bg-gray-700 hover:bg-gray-800 text-white"
        onClick={() => setIsOpen(true)}
        icon={<FontAwesomeIcon icon={faFileDownload} />}>
        ייצא ל IPlan
      </CustomButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnBackdropClick
        overlayClassName="animate-fade-in-0.5 overflow-y-auto"
        className="rounded-xl p-6 max-w-lg mx-4 max-h-[95vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">ייצוא ל IPlan</h2>

        <p className="text-sm text-gray-600 text-center mb-4">{totalNumberOfGuests} אורחים</p>

        {!hasFiltersOrSearch ? (
          <div
            className="flex gap-3 rounded-lg border border-sky-100 bg-sky-50/80 p-3 mb-6 text-right"
            dir="rtl"
            role="note">
            <FontAwesomeIcon icon={faCircleInfo} className="text-sky-600 mt-0.5 shrink-0" aria-hidden />
            <p className="text-sm text-gray-700 leading-relaxed">{IPLAN_EXPORT_INFO}</p>
          </div>
        ) : (
          <div className="mb-6 text-right" dir="rtl">
            <p className="text-sm font-medium text-gray-800 mb-2">הייצוא יכלול אורחים לפי המסננים:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {activeFilterLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        <CustomButton
          className="w-full justify-center"
          size={ButtonSize.MD}
          onClick={handleExport}
          icon={<FontAwesomeIcon icon={faFileDownload} />}>
          ייצוא
        </CustomButton>
      </Modal>
    </>
  )
}

export default ExportToIplanButton
