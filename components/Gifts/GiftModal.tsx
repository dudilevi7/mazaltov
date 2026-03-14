'use client'

import { useEffect, useMemo, useState } from 'react'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import type { Gift } from '@/types/Gift'
import { GiftType } from '@/types/Gift'
import type { Guest } from '@/types/Guest'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { GIFT_TYPE_LABELS } from './helper'

export interface GiftFormData {
  guestId: number | null
  amount: number
  type: GiftType
  description: string
  guestName: string
  guestSide: string
  guestCategory: string
}

interface GiftModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GiftFormData) => void
  gift?: Gift | null
  guests: Guest[]
}

const TYPE_OPTIONS: SelectOption[] = Object.values(GiftType).map((t) => ({
  value: t,
  label: GIFT_TYPE_LABELS[t] ?? t,
}))

const GiftModal = ({ isOpen, onClose, onSave, gift, guests }: GiftModalProps) => {
  const [selectedGuestId, setSelectedGuestId] = useState<string>('')
  const [amount, setAmount] = useState<string>('0')
  const [type, setType] = useState<GiftType>(GiftType.CASH)
  const [description, setDescription] = useState('')

  const isEdit = !!gift

  const guestOptions: SelectOption[] = useMemo(
    () => [{ value: '', label: 'בחר אורח' }, ...guests.map((g) => ({ value: String(g.id), label: g.name }))],
    [guests]
  )

  const selectedGuest = useMemo(
    () => guests.find((g) => String(g.id) === selectedGuestId) ?? null,
    [guests, selectedGuestId]
  )

  const canSubmit = selectedGuestId !== '' && parseFloat(amount) > 0

  useEffect(() => {
    if (isOpen) {
      setSelectedGuestId(gift?.guestId ? String(gift.guestId) : '')
      setAmount(gift ? String(gift.amount) : '0')
      setType(gift?.type ?? GiftType.CASH)
      setDescription(gift?.description ?? '')
    }
  }, [isOpen, gift])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave({
      guestId: selectedGuestId ? parseInt(selectedGuestId, 10) : null,
      amount: parseFloat(amount) || 0,
      type,
      description: description.trim(),
      guestName: selectedGuest?.name ?? gift?.guestName ?? '',
      guestSide: selectedGuest?.side ?? gift?.guestSide ?? '',
      guestCategory: selectedGuest?.category ?? gift?.guestCategory ?? '',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-right">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isEdit ? 'עריכת מתנה' : 'הוספת מתנה'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">אורח *</label>
              <SelectDropdown
                value={selectedGuestId}
                onChange={setSelectedGuestId}
                options={guestOptions}
                placeholder="בחר אורח"
                className="w-full"
                searchable
              />
              {selectedGuest && (
                <div className="mt-2 flex gap-2 text-xs text-gray-500">
                  <span>
                    צד: <span className="font-bold">{selectedGuest.side}</span>
                  </span>
                  <div className="border-l border-gray-300" />
                  <span>
                    קירבה: <span className="font-bold">{selectedGuest.category}</span>
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">סכום *</label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">סוג</label>
              <SelectDropdown
                value={type}
                onChange={(v) => setType(v as GiftType)}
                options={TYPE_OPTIONS}
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">תיאור</label>
              <input
                dir="rtl"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit" disabled={!canSubmit}>
              {isEdit ? 'שמור שינויים' : 'הוסף מתנה'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GiftModal
