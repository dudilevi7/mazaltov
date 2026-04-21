'use client'

import { useEffect, useMemo, useState } from 'react'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import type { Guest } from '@/types/Guest'
import { GuestStatus } from '@/types/Guest'
import { parseNumber } from '@/lib/utils'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import SelectDropdownWithCustomOption from '@/components/Shared/SelectDropdownWithCustomOption'
import { validatePhoneNumber, validateRealName, isNameInGuests, STATUS_OPTIONS } from './helper'
import Modal from '@/components/Shared/Modal'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import CustomCheckbox from '@/components/Shared/CustomCheckbox'

const CUSTOM_CATEGORY_VALUE = '__custom__'

export interface GuestFormData {
  name: string
  quantity: number
  status: GuestStatus
  side: string
  table?: number
  phoneNumber?: string
  category: string
  gift: number
  approved: number
  notes?: string
  vegan: boolean
  vegetarian: boolean
  glatKosher: boolean
  transportation: boolean
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
  const [side, setSide] = useState<SelectOption | null>({ value: '', label: '' })
  const [table, setTable] = useState<string>('0')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [category, setCategory] = useState('')
  const [approved, setApproved] = useState<string>('0')
  const [notes, setNotes] = useState('')
  const [vegan, setVegan] = useState(false)
  const [vegetarian, setVegetarian] = useState(false)
  const [glatKosher, setGlatKosher] = useState(false)
  const [transportation, setTransportation] = useState(false)

  const isEdit = !!guest
  const isPhoneValid = useMemo(() => validatePhoneNumber(phoneNumber || ''), [phoneNumber])
  const isRealName = useMemo(() => validateRealName(name || ''), [name])
  const nameExists = useMemo(() => isNameInGuests(name, existingGuests, guest?.id), [name, existingGuests, guest?.id])

  const categoryOptions = useMemo<SelectOption[]>(() => {
    const set = new Set<string>()
    existingGuests.forEach((g) => {
      const c = (g.category || '').trim()
      if (c) set.add(c)
    })
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ value: c, label: c }))
  }, [existingGuests])

  const quantityNum = parseNumber(quantity) || 0
  const hasValidQuantity = quantityNum >= 1
  const categorySelectValue = categoryOptions.some((o) => o.value === category) ? category : CUSTOM_CATEGORY_VALUE
  const categoryCustomValue = categorySelectValue === CUSTOM_CATEGORY_VALUE ? category : ''

  const canSubmit =
    name.trim().length > 0 &&
    isPhoneValid &&
    isRealName &&
    !nameExists &&
    side &&
    hasValidQuantity &&
    category.trim().length > 0

  useEffect(() => {
    if (isOpen) {
      setName(guest?.name || '')
      setQuantity(guest ? String(guest.quantity) : '1')
      setStatus(guest?.status ?? GuestStatus.PENDING)
      setSide(
        guest?.side
          ? (sideOptions.find((opt) => opt.label.trim() === guest.side.trim()) ?? null)
          : (sideOptions[0] ?? null)
      )
      setTable(guest?.table !== undefined ? String(guest.table) : '0')
      setPhoneNumber(guest?.phoneNumber || '')
      setCategory(guest?.category || '')
      setApproved(guest ? String(guest.approved ?? 0) : '0')
      setNotes(guest?.notes || '')
      setVegan(guest?.vegan ?? false)
      setVegetarian(guest?.vegetarian ?? false)
      setGlatKosher(guest?.glatKosher ?? false)
      setTransportation(guest?.transportation ?? false)
    }
  }, [isOpen, guest, sideOptions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const tableNum = parseNumber(table)
    const quantityNum = Math.max(1, parseInt(quantity, 10) || 1)
    const approvedNum = Math.max(0, parseInt(approved, 10) || 0)
    const resolvedApproved =
      status === GuestStatus.ACCEPTED && approvedNum === 0 ? quantityNum : approvedNum
    onSave({
      name: name.trim(),
      quantity: quantityNum,
      status,
      side: side?.label ?? '',
      table: tableNum > 0 ? tableNum : undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      category: category.trim(),
      gift: 0,
      approved: resolvedApproved,
      notes: notes.trim() || undefined,
      vegan,
      vegetarian,
      glatKosher,
      transportation,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl text-right max-h-[90vh] overflow-y-auto" header={isEdit ? 'עריכת אורח' : 'הוספת אורח'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
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
              <label className="mb-1 block text-sm font-medium text-gray-700">מגיעים בפועל</label>
              <input
                type="number"
                min="0"
                value={approved}
                onChange={(e) => setApproved(e.target.value)}
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
              <SelectDropdown
                value={side?.value ?? sideOptions[0]?.value ?? ''}
                onChange={(value) => setSide(sideOptions.find((opt) => opt.value === value) ?? null)}
                options={sideOptions}
                className="w-full"
              />
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
              <SelectDropdownWithCustomOption
                value={categorySelectValue}
                onValueChange={(v) => setCategory(v === CUSTOM_CATEGORY_VALUE ? categoryCustomValue : v)}
                customValue={categoryCustomValue}
                onCustomValueChange={setCategory}
                options={categoryOptions}
                customOptionLabel="אחר"
                customOptionValue={CUSTOM_CATEGORY_VALUE}
                placeholder="בחר או הזן קירבה"
                customPlaceholder="צור קירבה"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">הערות</label>
              <textarea
                dir="rtl"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="הערות נוספות על האורח..."
              />
            </div>
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-gray-700">פרטים נוספים</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <CustomCheckbox checked={vegan} onChange={setVegan} label="טבעוני" />
                <CustomCheckbox checked={vegetarian} onChange={setVegetarian} label="צמחוני" />
                <CustomCheckbox checked={glatKosher} onChange={setGlatKosher} label="גלאט כשר" />
                <CustomCheckbox checked={transportation} onChange={setTransportation} label="הסעות" />
              </div>
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
    </Modal>
  )
}

export default GuestModal
