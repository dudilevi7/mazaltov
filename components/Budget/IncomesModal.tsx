'use client'

import { useEffect, useState } from 'react'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import type { EstimatedIncome } from '@/types/Income'
import { parseNumber } from '@/lib/utils'

interface IncomesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EstimatedIncome) => void
  estimatedIncome?: EstimatedIncome | null
}

const IncomesModal = ({ isOpen, onClose, onSave, estimatedIncome }: IncomesModalProps) => {
  const [numberOfGuests, setNumberOfGuests] = useState<string>('')
  const [avgGiftPerGuest, setAvgGiftPerGuest] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setNumberOfGuests(estimatedIncome ? String(estimatedIncome.numberOfGuests) : '')
      setAvgGiftPerGuest(estimatedIncome ? String(estimatedIncome.avgGiftPerGuest) : '')
    }
  }, [isOpen, estimatedIncome])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      numberOfGuests: parseNumber(numberOfGuests),
      avgGiftPerGuest: parseNumber(avgGiftPerGuest),
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-right" header="הכנסות משוערות">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">אורחים</label>
            <input
              dir="rtl"
              type="number"
              min="0"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">מתנה ממוצעת לאורח</label>
            <input
              dir="rtl"
              type="number"
              min="0"
              value={avgGiftPerGuest}
              onChange={(e) => setAvgGiftPerGuest(e.target.value)}
              className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit">
              שמור
            </CustomButton>
          </div>
      </form>
    </Modal>
  )
}

export default IncomesModal
