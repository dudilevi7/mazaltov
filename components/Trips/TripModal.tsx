'use client'

import { useEffect, useState } from 'react'
import type { Trip } from '@/types/Trip'
import { TripType } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import Modal from '@/components/Shared/Modal'
import { getTripCopy, getTripTypeOptions } from '@/constants/trips'
import { INPUT_CLASS } from './helper'

export interface TripFormData {
  name: string
  tripType: TripType
}

interface TripModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: TripFormData) => void
  trip?: Trip | null
  isRtl: boolean
}

const TripModal = ({ isOpen, onClose, onSave, trip, isRtl }: TripModalProps) => {
  const copy = getTripCopy(isRtl)
  const [name, setName] = useState('')
  const [tripType, setTripType] = useState<TripType>(TripType.HONEYMOON)
  const isEdit = !!trip

  useEffect(() => {
    if (!isOpen) return
    setName(trip?.name ?? '')
    setTripType(trip?.tripType ?? TripType.HONEYMOON)
  }, [isOpen, trip])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name: name.trim(), tripType })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-right" header={isEdit ? copy.editTripHeader : copy.addTripHeader}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.tripName}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.tripType}</label>
          <SelectDropdown
            value={tripType}
            onChange={(value) => setTripType(value as TripType)}
            options={getTripTypeOptions(isRtl)}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
            {copy.cancel}
          </CustomButton>
          <CustomButton size={ButtonSize.SM} type="submit">
            {isEdit ? copy.save : copy.addTrip}
          </CustomButton>
        </div>
      </form>
    </Modal>
  )
}

export default TripModal
