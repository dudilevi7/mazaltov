'use client'

import { useMemo, useState } from 'react'
import { useGiftsContext } from '@/context/GiftsContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift, faFileExcel, faCircleInfo, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import {
  GIFT_TYPE_LABELS,
  GIFT_TYPE_COLORS,
  formatCurrency,
  exportGiftsToExcel,
  exportGiftsToPdf,
  buildGiftActiveFilterLines,
} from './helper'
import GiftsGuestNameDuplicatesAlert from './GiftsGuestNameDuplicatesAlert'

const GIFTS_EXPORT_INFO =
  'תוכלו גם לייצא לאקסל את המתנות באמצעות סינון האורחים למשל להורי הכלה. אם תרצו כל מסנן סננו את הטבלה כיצד שתראו לנכון וחזרו לחלון הזה.'

const GiftsSummaryBar = () => {
  const {
    totalAmount,
    amountByType,
    averageGift,
    headCount,
    filteredGifts,
    filteredStats,
    hasFiltersOrSearch,
    searchQuery,
    sideFilter,
    categoryFilter,
    typeFilter,
    guestNameDuplicateGroups,
  } = useGiftsContext()
  const [exportModalOpen, setExportModalOpen] = useState(false)

  const activeFilterLines = useMemo(() => {
    return buildGiftActiveFilterLines({
      searchQuery,
      sideLabel: sideFilter.value === 'all' ? null : sideFilter.label,
      categoryValues: categoryFilter,
      typeValue: typeFilter,
    })
  }, [searchQuery, sideFilter, categoryFilter, typeFilter])

  const handleExportExcel = () => {
    exportGiftsToExcel(filteredGifts, filteredStats)
    setExportModalOpen(false)
  }
  const handleExportPdf = async () => {
    await exportGiftsToPdf(filteredGifts, filteredStats)
    setExportModalOpen(false)
  }

  return (
    <div className="mb-4 flex flex-wrap flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex flex-row items-center gap-3 flex-wrap text-gray-700 border-b border-gray-200 pb-2">
        <div className="flex flex-row items-center gap-2">
          <FontAwesomeIcon icon={faGift} className="text-pink-500 text-lg" />
          <span className="font-medium text-base">סה&quot;כ מתנות</span>
        </div>
        <span className="font-bold text-2xl">{formatCurrency(totalAmount)}</span>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-gray-600">
          מתנה ממוצעת לאורח: <span className="font-bold text-gray-800">{formatCurrency(averageGift)}</span>
          <span className="text-gray-400 mx-1">·</span>
          <span className="text-gray-500">{headCount} אורחים</span>
        </span>
        {hasFiltersOrSearch && (
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">לפי מסננים</span>
        )}
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        {Object.entries(amountByType)
          .filter(([, amount]) => amount > 0)
          .map(([type, amount]) => (
            <span
              key={type}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${GIFT_TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-800'}`}>
              {GIFT_TYPE_LABELS[type] ?? type}: {formatCurrency(amount)}
            </span>
          ))}
        <div className="ms-auto">
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            onClick={() => setExportModalOpen(true)}
            icon={
              <div className="flex flex-row items-center gap-1">
                <FontAwesomeIcon icon={faFileExcel} className="text-green-600" />
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />
              </div>
            }>
            ייצוא לאקסל | PDF
          </CustomButton>
        </div>
      </div>

      <GiftsGuestNameDuplicatesAlert groups={guestNameDuplicateGroups} />

      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        closeOnBackdropClick
        overlayClassName="animate-fade-in-0.5 overflow-y-auto"
        className="rounded-xl p-6 max-w-lg mx-4 max-h-[95vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">ייצוא מתנות</h2>

        <p className="text-sm text-gray-600 text-center mb-4">
          {filteredGifts.length} מתנות · {formatCurrency(totalAmount)} · ממוצע{' '}
          {formatCurrency(averageGift)} לאורח
        </p>

        {!hasFiltersOrSearch ? (
          <div
            className="flex gap-3 rounded-lg border border-sky-100 bg-sky-50/80 p-3 mb-6 text-right"
            dir="rtl"
            role="note">
            <FontAwesomeIcon icon={faCircleInfo} className="text-sky-600 mt-0.5 shrink-0" aria-hidden />
            <p className="text-sm text-gray-700 leading-relaxed">{GIFTS_EXPORT_INFO}</p>
          </div>
        ) : (
          <div className="mb-6 text-right" dir="rtl">
            <p className="text-sm font-medium text-gray-800 mb-2">הייצוא יכלול מתנות לפי המסננים:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {activeFilterLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <CustomButton
            className="w-full justify-center"
            size={ButtonSize.MD}
            variant="white"
            onClick={handleExportExcel}
            icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
            ייצוא לאקסל
          </CustomButton>
          <CustomButton
            className="w-full justify-center"
            size={ButtonSize.MD}
            variant="white"
            onClick={handleExportPdf}
            icon={<FontAwesomeIcon icon={faFilePdf} className="text-red-600" />}>
            ייצוא ל-PDF
          </CustomButton>
        </div>
      </Modal>
    </div>
  )
}

export default GiftsSummaryBar
