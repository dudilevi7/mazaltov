'use client'

import { useEffect, useState } from 'react'
import type { Hotel } from '@/types/Trip'
import { TripCurrency } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import Modal from '@/components/Shared/Modal'
import { CURRENCY_OPTIONS, getTripCopy } from '@/constants/trips'
import { INPUT_CLASS, emptyHotel } from './helper'

interface HotelModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (hotel: Omit<Hotel, 'id'>) => void
  hotel?: Hotel | null
  isRtl: boolean
}

const HotelModal = ({ isOpen, onClose, onSave, hotel, isRtl }: HotelModalProps) => {
  const copy = getTripCopy(isRtl)
  const isEdit = !!hotel
  const [values, setValues] = useState(emptyHotel())

  useEffect(() => {
    if (!isOpen) return
    if (hotel) {
      const { id: _id, ...rest } = hotel
      setValues(rest)
    } else {
      setValues(emptyHotel())
    }
  }, [isOpen, hotel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl text-right" header={isEdit ? copy.editHotel : copy.addHotel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.hotelName}</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            required
            className={INPUT_CLASS}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.country}</label>
            <input
              type="text"
              value={values.country}
              onChange={(e) => setValues({ ...values, country: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.city}</label>
            <input
              type="text"
              value={values.city}
              onChange={(e) => setValues({ ...values, city: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.checkIn}</label>
            <input
              type="date"
              dir="ltr"
              value={values.checkIn}
              onChange={(e) => setValues({ ...values, checkIn: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.checkOut}</label>
            <input
              type="date"
              dir="ltr"
              value={values.checkOut}
              onChange={(e) => setValues({ ...values, checkOut: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{copy.price}</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={values.totalPrice || ''}
              onChange={(e) => setValues({ ...values, totalPrice: parseFloat(e.target.value) || 0 })}
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
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.bookingUrl}</label>
          <input
            type="text"
            dir="ltr"
            value={values.bookingUrl}
            onChange={(e) => setValues({ ...values, bookingUrl: e.target.value })}
            className={INPUT_CLASS}
          />
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
            {isEdit ? copy.save : copy.addHotel}
          </CustomButton>
        </div>
      </form>
    </Modal>
  )
}

export default HotelModal
