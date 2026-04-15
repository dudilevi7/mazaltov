'use client'

import { useEffect, useMemo, useState } from 'react'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SelectDropdownWithCustomOption from '@/components/Shared/SelectDropdownWithCustomOption'
import type { Provider } from '@/types/Provider'
import { PaymentMethod } from '@/types/Provider'
import { parseNumber } from '@/lib/utils'
import { validatePhoneNumber } from './helper'
import { SUGGESTED_SERVICES_OPTIONS, getSuggestedServiceByLabel } from '@/constants/providers'
import SelectDropdown from '../Shared/SelectDropdown'
import Modal from '@/components/Shared/Modal'

interface ProvidersModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProviderFormData) => void
  provider?: Provider | null
}

export interface ProviderFormData {
  name: string
  phone?: string
  service: string
  price: number
  advancePayment: number
  toBePaid: number
  comments: string
  paymentMethod: PaymentMethod
}

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: PaymentMethod.CASH, label: 'מזומן' },
  { value: PaymentMethod.CHECK, label: 'צ׳ק' },
  { value: PaymentMethod.BIT, label: 'ביט' },
  { value: PaymentMethod.PAYBOX, label: 'פייבוקס' },
  { value: PaymentMethod.CREDIT_CARD, label: 'אשראי' },
  { value: PaymentMethod.TRANSFER, label: 'העברה בנקאית' },
  { value: PaymentMethod.OTHER, label: 'אחר' },
]

const ProvidersModal = ({ isOpen, onClose, onSave, provider }: ProvidersModalProps) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [customService, setCustomService] = useState('')
  const [price, setPrice] = useState<string>('')
  const [advancePayment, setAdvancePayment] = useState<string>('')
  const [comments, setComments] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CHECK)

  const isPhoneValid = useMemo(() => validatePhoneNumber(phone || ''), [phone])
  const isEdit = !!provider

  const computedToBePaid = useMemo(() => {
    const total = parseNumber(price || '0')
    const advance = parseNumber(advancePayment || '0')
    const diff = total - advance
    return diff < 0 ? 0 : diff
  }, [price, advancePayment])

  useEffect(() => {
    if (isOpen) {
      setName(provider?.name || '')
      setPhone(provider?.phone || '')
      const existingService = provider?.service || ''
      const isSuggested = !!getSuggestedServiceByLabel(existingService)
      setService(isSuggested ? existingService : existingService ? '__custom__' : '')
      setCustomService(isSuggested ? '' : existingService)
      setPrice(provider ? String(provider.price ?? '') : '')
      setAdvancePayment(provider ? String(provider.advancePayment ?? '') : '')
      setComments(provider?.comments || '')
      setPaymentMethod(provider?.paymentMethod ?? PaymentMethod.CASH)
    }
  }, [isOpen, provider])

  const resolvedService = service === '__custom__' ? customService : service

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      name,
      phone: phone || undefined,
      service: resolvedService,
      price: parseNumber(price),
      advancePayment: parseNumber(advancePayment),
      toBePaid: computedToBePaid,
      comments,
      paymentMethod,
    })

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl text-right" header={isEdit ? 'עריכת ספק' : 'הוספת ספק חדש'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">שם ספק</label>
              <input
                dir="rtl"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">טלפון</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                dir="ltr"
              />
            </div>
            {!isPhoneValid && <div className="text-red-500 text-sm">הטלפון שגוי</div>}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">שירות</label>
              <SelectDropdownWithCustomOption
                value={service}
                onValueChange={setService}
                customValue={customService}
                onCustomValueChange={setCustomService}
                options={SUGGESTED_SERVICES_OPTIONS}
                placeholder="בחר שירות"
                customPlaceholder="הכנס שירות מותאם"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">מחיר כולל</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">תשלום מקדמה</label>
              <input
                type="number"
                min="0"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(e.target.value)}
                className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">נותר לתשלום</label>
              <input
                type="number"
                min="0"
                value={Number.isNaN(computedToBePaid) ? '' : String(computedToBePaid)}
                readOnly
                className="w-full text-right rounded-md bg-gray-100 border border-gray-300 px-3 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">אמצעי תשלום</label>
              <SelectDropdown
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value as PaymentMethod)}
                options={paymentMethodOptions}
                placeholder="בחר אמצעי תשלום"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">הערות</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              dir="rtl"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit">
              {isEdit ? 'שמור שינויים' : 'הוסף ספק'}
            </CustomButton>
          </div>
      </form>
    </Modal>
  )
}

export default ProvidersModal
