'use client'

import { useEffect, useMemo, useState } from 'react'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import type { Guest } from '@/types/Guest'
import { GuestStatus } from '@/types/Guest'
import { parseNumber } from '@/lib/utils'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import Toggle from '@/components/Shared/Toggle'
import { validatePhoneNumber, validateRealName, isNameInGuests, STATUS_OPTIONS } from './helper'
import type { SelectOption } from '@/components/Shared/SelectDropdown'

export interface GuestFormData {
  name: string
  quantity: number
  status: GuestStatus
  side: string
  table?: number
  phoneNumber?: string
  category: string
  gift: number
  manualApproval: boolean
}

interface GuestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GuestFormData) => void
  guest?: Guest | null
  existingGuests: Guest[]
  sideOptions: SelectOption[]
}

const GuestModal = ({ isOpen, onClose, onSave, guest, existingGuests, sideOptions }: GuestModalProps) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<string>('1')
  const [status, setStatus] = useState<GuestStatus>(GuestStatus.PENDING)
  const [side, setSide] = useState<string>('')
  const [table, setTable] = useState<string>('0')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [category, setCategory] = useState('')
  const [gift, setGift] = useState<string>('0')
  const [manualApproval, setManualApproval] = useState(false)

  const isEdit = !!guest
  const isPhoneValid = useMemo(() => validatePhoneNumber(phoneNumber || ''), [phoneNumber])
  const isRealName = useMemo(() => validateRealName(name || ''), [name])
  const nameExists = useMemo(() => isNameInGuests(name, existingGuests, guest?.id), [name, existingGuests, guest?.id])
  const canSubmit = isPhoneValid && isRealName && !nameExists && side && category.trim().length > 0

  useEffect(() => {
    if (isOpen) {
      setName(guest?.name || '')
      setQuantity(guest ? String(guest.quantity) : '1')
      setStatus(guest?.status ?? GuestStatus.PENDING)
      setSide(guest?.side ?? sideOptions[0]?.value ?? '')
      setTable(guest?.table !== undefined ? String(guest.table) : '0')
      setPhoneNumber(guest?.phoneNumber || '')
      setCategory(guest?.category || '')
      setGift(guest ? String(guest.gift) : '0')
      setManualApproval(guest?.manualApproval ?? false)
    }
  }, [isOpen, guest, sideOptions])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const tableNum = parseNumber(table)
    onSave({
      name: name.trim(),
      quantity: Math.max(1, parseInt(quantity, 10) || 1),
      status,
      side,
      table: tableNum > 0 ? tableNum : undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      category: category.trim(),
      gift: parseNumber(gift),
      manualApproval,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-right">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isEdit ? 'עריכת אורח' : 'הוספת אורח'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">שם *</label>
              <input
                dir="rtl"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              {name.trim() && !isRealName && <p className="mt-1 text-sm text-red-500">נא להזין שם מלא תקין</p>}
              {nameExists && <p className="mt-1 text-sm text-red-500">שם זה כבר קיים ברשימה</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">כמות</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">סטטוס</label>
              <SelectDropdown
                value={status}
                onChange={(v) => setStatus(v as GuestStatus)}
                options={STATUS_OPTIONS}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">צד *</label>
              <SelectDropdown value={side} onChange={(v) => setSide(v)} options={sideOptions} className="w-full" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">שולחן (אופציונלי)</label>
              <input
                type="number"
                min="0"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">טלפון</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                dir="ltr"
              />
              {phoneNumber && !isPhoneValid && <p className="mt-1 text-sm text-red-500">מספר טלפון לא תקין</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">קירבה *</label>
              <input
                dir="rtl"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">מתנה</label>
              <input
                type="number"
                min="0"
                value={gift}
                onChange={(e) => setGift(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <Toggle enabled={manualApproval} onChange={setManualApproval} label="אישור ידני" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit" disabled={!canSubmit}>
              {isEdit ? 'שמור שינויים' : 'הוסף אורח'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GuestModal
