'use client'

import { useState, useEffect, useMemo } from 'react'
import type { ShoppingItem } from '@/types/ShoppingItem'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import { useAppContext } from '@/context/AppContext'
import { getEventOwnerOptions } from '@/components/TodoModal/helper'

export interface ShoppingFormData {
  name: string
  quantity: number
  category: string
  notes: string
  estimatedPrice: number
  isPurchased: boolean
  createdBy: string
}

interface ShoppingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ShoppingFormData) => void
  item?: ShoppingItem | null
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'ללא קטגוריה' },
  { value: 'decoration', label: 'קישוטים' },
  { value: 'food', label: 'אוכל ושתייה' },
  { value: 'clothing', label: 'ביגוד' },
  { value: 'flowers', label: 'פרחים' },
  { value: 'gifts', label: 'מתנות' },
  { value: 'stationery', label: 'הזמנות ודפוס' },
  { value: 'other', label: 'אחר' },
]

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o.label])
)

const ShoppingModal = ({ isOpen, onClose, onSave, item }: ShoppingModalProps) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [createdBy, setCreatedBy] = useState('')
  const { eventSettings } = useAppContext()
  const ownerOptions = useMemo(() => getEventOwnerOptions(eventSettings), [eventSettings])

  const isEdit = !!item

  useEffect(() => {
    if (isOpen) {
      setName(item?.name || '')
      setQuantity(item?.quantity ?? 1)
      setCategory(item?.category || '')
      setNotes(item?.notes || '')
      setEstimatedPrice(item?.estimatedPrice ?? 0)
      const nextCreatedBy = item?.createdBy || ''
      setCreatedBy(nextCreatedBy || (ownerOptions[0]?.value ?? ''))
    }
  }, [isOpen, item, ownerOptions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      quantity,
      category,
      notes,
      estimatedPrice,
      isPurchased: item?.isPurchased ?? false,
      createdBy,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-right">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-fade-in">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {isEdit ? 'עריכת פריט' : 'הוספת פריט חדש'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">שם הפריט</label>
            <input
              dir="rtl"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">כמות</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">מחיר משוער</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={estimatedPrice || ''}
                onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
                placeholder="₪"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">קטגוריה</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              dir="rtl">
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 text-right">נוסף על ידי</label>
            <SelectDropdown
              value={createdBy}
              onChange={setCreatedBy}
              options={ownerOptions}
              placeholder="בחר אחראי"
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">הערות</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              dir="rtl"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <CustomButton size={ButtonSize.SM} type="button" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit">
              {isEdit ? 'שמור שינויים' : 'הוסף פריט'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export { CATEGORY_LABELS }
export default ShoppingModal
