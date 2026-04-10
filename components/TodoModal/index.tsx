'use client'

import { useState, useEffect, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import { Todo, TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { useAppContext } from '@/context/AppContext'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import { getEventOwnerOptions } from './helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { buildGoogleCalendarUrl } from '@/components/Tasks/helper'
import { STATUS_OPTIONS } from '@/constants/todoStatus'

interface TodoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: TodoFormData) => void
  todo?: Todo | null
  initialData?: Partial<TodoFormData>
}

export interface TodoFormData {
  name: string
  description: string
  status: TodoStatus
  reminderTimestamp: number
  updatedBy: string
  providerId?: number
  comments?: string
}

const toReminderDate = (todo?: Todo | null, initial?: Partial<TodoFormData>): Date | null => {
  const ts = todo?.reminderTimestamp || initial?.reminderTimestamp
  return ts ? new Date(ts) : null
}

export default function TodoModal({ isOpen, onClose, onSave, todo, initialData }: TodoModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.PENDING)
  const [reminderDate, setReminderDate] = useState<Date | null>(null)
  const [updatedBy, setUpdatedBy] = useState('')
  const { eventSettings } = useAppContext()
  const ownerOptions = useMemo(() => getEventOwnerOptions(eventSettings), [eventSettings])
  const isEdit = !!todo

  useEffect(() => {
    if (!isOpen) return
    setName(todo?.name || initialData?.name || '')
    setDescription(todo?.description || initialData?.description || '')
    setStatus(todo?.status ?? initialData?.status ?? TodoStatus.PENDING)
    setReminderDate(toReminderDate(todo, initialData))
    const who = todo?.updatedBy || initialData?.updatedBy || ''
    setUpdatedBy(who || (ownerOptions[0]?.value ?? ''))
  }, [isOpen, todo, initialData, ownerOptions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      status,
      reminderTimestamp: reminderDate ? reminderDate.getTime() : 0,
      updatedBy,
      providerId: todo?.providerId ?? initialData?.providerId,
      comments: todo?.comments,
    })
  }

  if (!isOpen) return null

  const inputClass =
    'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-right px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{isEdit ? 'עריכת משימה' : 'הוספת משימה חדשה'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">שם</label>
            <input
              dir="rtl"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${inputClass} text-right`}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">תיאור</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              dir="rtl"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 text-right">סטטוס</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TodoStatus)}
              className={`${inputClass} text-right`}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">תזכורת</label>
            <DatePicker
              selected={reminderDate}
              onChange={(date: Date | null) => setReminderDate(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText="בחר תאריך ושעה"
              className={inputClass}
              isClearable
            />
          </div>
          <div className="flex justify-end">
            <CustomButton
              type="button"
              disabled={!name}
              className="bg-linear-to-r from-blue-200 to-blue-300 text-white! hover:text-gray-700! transition-colors duration-300"
              icon={<FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />}
              onClick={() => {
                if (!name) return
                window.open(
                  buildGoogleCalendarUrl(name, description, reminderDate ? reminderDate.getTime() : 0),
                  '_blank'
                )
              }}>
              הוסף לגוגל קלנדר
            </CustomButton>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 text-right">עודכן על ידי</label>
            <SelectDropdown
              value={updatedBy}
              onChange={setUpdatedBy}
              options={ownerOptions}
              placeholder="בחר אחראי"
              className="w-full"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <CustomButton size={ButtonSize.SM} type="button" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit">
              {isEdit ? 'שמור שינויים' : 'הוסף משימה'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  )
}
