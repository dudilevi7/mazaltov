'use client'

import type { ShoppingItem } from '@/types/ShoppingItem'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import { formatDateDDMMYY } from '@/lib/dateUtils'
import { formatCurrency } from '@/lib/utils'
import { CATEGORY_LABELS } from './ShoppingModal'

interface ShoppingDetailModalProps {
  item: ShoppingItem
  onClose: () => void
}

const ShoppingDetailModal = ({ item, onClose }: ShoppingDetailModalProps) => {
  return (
    <Modal
      isOpen
      onClose={onClose}
      className="max-w-lg"
      header="פרטי פריט"
      actions={
        <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
          סגור
        </CustomButton>
      }>
      <div className="flex flex-col gap-4 px-6 py-5" dir="rtl">
          <div>
            <span className="text-xs font-medium text-gray-500">שם הפריט</span>
            <p className="text-gray-900 font-medium">{item.name}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-xs font-medium text-gray-500">כמות</span>
              <p className="text-gray-700">{item.quantity}</p>
            </div>

            {item.estimatedPrice > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500">מחיר משוער</span>
                <p className="text-gray-700 font-medium">{formatCurrency(item.estimatedPrice)}</p>
              </div>
            )}

            {item.category && (
              <div>
                <span className="text-xs font-medium text-gray-500">קטגוריה</span>
                <div>
                  <span className="inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {item.createdBy && (
              <div>
                <span className="text-xs font-medium text-gray-500">נוסף על ידי</span>
                <p className="text-gray-700">{item.createdBy}</p>
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-gray-500">נוצר ב</span>
              <p className="text-gray-700">{formatDateDDMMYY(item.createdAt)}</p>
            </div>
          </div>

          {item.notes && (
            <div>
              <span className="text-xs font-medium text-gray-500">הערות</span>
              <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 rounded-md p-3">{item.notes}</p>
            </div>
          )}

          <div>
            <span className="text-xs font-medium text-gray-500">סטטוס</span>
            <div>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  item.isPurchased ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                }`}>
                {item.isPurchased ? 'נקנה' : 'לא נקנה'}
              </span>
            </div>
          </div>
      </div>
    </Modal>
  )
}

export default ShoppingDetailModal
