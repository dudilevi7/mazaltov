'use client'

import { useEffect, useState } from 'react'
import type { Attraction } from '@/types/Trip'
import { TripCurrency } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import Modal from '@/components/Shared/Modal'
import { CURRENCY_OPTIONS, getTripCopy } from '@/constants/trips'
import { INPUT_CLASS, emptyAttraction } from './helper'

interface AttractionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (attraction: Omit<Attraction, 'id'>) => void
  attraction?: Attraction | null
  isRtl: boolean
}

const AttractionModal = ({ isOpen, onClose, onSave, attraction, isRtl }: AttractionModalProps) => {
  const copy = getTripCopy(isRtl)
  const isEdit = !!attraction
  const [values, setValues] = useState(emptyAttraction())

  useEffect(() => {
    if (!isOpen) return
    if (attraction) {
      const { id: _id, ...rest } = attraction
      setValues(rest)
    } else {
      setValues(emptyAttraction())
    }
  }, [isOpen, attraction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="text-right"
      header={isEdit ? copy.editAttraction : copy.addAttraction}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.attractionName}</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            required
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.date}</label>
          <input
            type="date"
            dir="ltr"
            value={values.date}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.price}</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={values.price || ''}
              onChange={(e) => setValues({ ...values, price: parseFloat(e.target.value) || 0 })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.currency}</label>
            <SelectDropdown
              value={values.currency}
              onChange={(value) => setValues({ ...values, currency: value as TripCurrency })}
              options={CURRENCY_OPTIONS}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.description}</label>
          <textarea
            rows={2}
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
            {copy.cancel}
          </CustomButton>
          <CustomButton size={ButtonSize.SM} type="submit">
            {isEdit ? copy.save : copy.addAttraction}
          </CustomButton>
        </div>
      </form>
    </Modal>
  )
}

export default AttractionModal
