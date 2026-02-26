'use client'

import type { ShoppingItem } from '@/types/ShoppingItem'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen, faUser } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'
import { CATEGORY_LABELS } from './ShoppingModal'

interface ShoppingListItemProps {
  item: ShoppingItem
  onToggle: (item: ShoppingItem) => void
  onEdit: (item: ShoppingItem) => void
  onDelete: (item: ShoppingItem) => void
}

const ShoppingListItem = ({ item, onToggle, onEdit, onDelete }: ShoppingListItemProps) => {
  const categoryLabel = CATEGORY_LABELS[item.category] || ''

  return (
    <li
      className={`group flex items-center gap-3 rounded-lg p-3 transition-all
        ${item.isPurchased ? 'bg-gray-50 opacity-70' : 'bg-white inset-shadow-sm shadow-gray-200 hover:shadow-md'}`}
      dir="rtl">
      <input
        type="checkbox"
        checked={item.isPurchased}
        onChange={() => onToggle(item)}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-blue-500 accent-blue-500"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-gray-900 ${item.isPurchased ? 'line-through text-gray-400' : ''}`}>
            {item.name}
          </span>
          {item.quantity > 1 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              x{item.quantity}
            </span>
          )}
          {categoryLabel && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              {categoryLabel}
            </span>
          )}
        </div>
        {item.notes && (
          <p className={`mt-0.5 text-xs truncate ${item.isPurchased ? 'text-gray-300' : 'text-gray-500'}`}>
            {item.notes}
          </p>
        )}
        {item.createdBy && (
          <div
            className={`mt-0.5 flex items-center gap-1 text-xs ${item.isPurchased ? 'text-gray-300' : 'text-gray-400'}`}>
            <FontAwesomeIcon icon={faUser} className="h-2.5 w-2.5" />
            <span>{item.createdBy}</span>
          </div>
        )}
      </div>

      {item.estimatedPrice > 0 && (
        <span className={`shrink-0 text-sm font-medium ${item.isPurchased ? 'text-gray-400' : 'text-gray-700'}`}>
          {formatCurrency(item.estimatedPrice)}
        </span>
      )}

      <div className="flex shrink-0 gap-1">
        <CustomButton size={ButtonSize.SM} variant="white" onClick={() => onEdit(item)}>
          <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
        </CustomButton>
        <CustomButton size={ButtonSize.SM} variant="red" onClick={() => onDelete(item)}>
          <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
        </CustomButton>
      </div>
    </li>
  )
}

export default ShoppingListItem
