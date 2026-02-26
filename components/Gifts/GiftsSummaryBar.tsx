'use client'

import { useGiftsContext } from '@/context/GiftsContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { GIFT_TYPE_LABELS, GIFT_TYPE_COLORS, formatCurrency, exportGiftsToExcel } from './helper'

const GiftsSummaryBar = () => {
  const { gifts, totalAmount, amountByType } = useGiftsContext()

  return (
    <div className="mb-4 flex flex-wrap flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex flex-row items-center gap-2 text-gray-700 border-b border-gray-200 pb-2">
        <div className="flex flex-row items-center gap-2">
          <FontAwesomeIcon icon={faGift} className="text-pink-500 text-lg" />
          <span className="font-medium text-base">סה&quot;כ מתנות</span>
        </div>
        <span className="font-bold text-2xl">{formatCurrency(totalAmount)}</span>
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
            onClick={() => exportGiftsToExcel(gifts)}
            icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
            ייצוא לאקסל
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default GiftsSummaryBar
