'use client'

import { useEffect, useState } from 'react'
import type { TripTask } from '@/types/Trip'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import CustomCheckbox from '@/components/Shared/CustomCheckbox'
import Modal from '@/components/Shared/Modal'
import { getTripCopy } from '@/constants/trips'
import { INPUT_CLASS } from './helper'

interface TripTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Omit<TripTask, 'id'>) => void
  task?: TripTask | null
  isRtl: boolean
}

const TripTaskModal = ({ isOpen, onClose, onSave, task, isRtl }: TripTaskModalProps) => {
  const copy = getTripCopy(isRtl)
  const isEdit = !!task
  const [title, setTitle] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setTitle(task?.title ?? '')
    setIsDone(task?.isDone ?? false)
  }, [isOpen, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title: title.trim(),
      isDone,
      isSuggested: task?.isSuggested ?? false,
      templateId: task?.templateId,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-right" header={isEdit ? copy.editTask : copy.addTask}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{copy.taskTitle}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={INPUT_CLASS}
          />
        </div>
        <CustomCheckbox checked={isDone} onChange={setIsDone} label={copy.done} />
        <div className="flex justify-end gap-2 pt-2">
          <CustomButton size={ButtonSize.SM} type="button" variant="white" onClick={onClose}>
            {copy.cancel}
          </CustomButton>
          <CustomButton size={ButtonSize.SM} type="submit">
            {isEdit ? copy.save : copy.addTask}
          </CustomButton>
        </div>
      </form>
    </Modal>
  )
}

export default TripTaskModal
