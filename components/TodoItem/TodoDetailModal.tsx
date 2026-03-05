'use client'

import { useState } from 'react'
import { Todo, TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { formatDateDDMMYY, formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import { useAppContext } from '@/context/AppContext'
import { buildGoogleCalendarUrl } from './helper'

const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'ממתין',
  [TodoStatus.IN_PROGRESS]: 'בתהליך',
  [TodoStatus.COMPLETED]: 'הושלם',
}

const STATUS_COLORS: Record<TodoStatus, string> = {
  [TodoStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [TodoStatus.IN_PROGRESS]: 'bg-amber-200 text-amber-800',
  [TodoStatus.PENDING]: 'bg-gray-200 text-gray-800',
}

interface TodoDetailModalProps {
  todo: Todo
  providerName?: string
  onClose: () => void
  onSaveComments: (todo: Todo, comments: string) => void
}

const TodoDetailModal = ({ todo, providerName, onClose, onSaveComments }: TodoDetailModalProps) => {
  const { languageDirection } = useAppContext()
  const [comments, setComments] = useState(todo.comments || '')
  const isDirty = comments !== (todo.comments || '')

  const handleSave = () => {
    onSaveComments(todo, comments)
  }

  const handleAddToCalendar = () => {
    window.open(buildGoogleCalendarUrl(todo.name, todo.description, todo.reminderTimestamp), '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl animate-fade-in" dir={languageDirection}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">פרטי משימה</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="הוסף לגוגל קלנדר"
              className="cursor-pointer rounded-md text-gray-400 hover:text-blue-500 transition-colors"
              onClick={handleAddToCalendar}>
              <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-md text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div>
            <span className="text-xs font-medium text-gray-500">שם</span>
            <p className="text-gray-900 font-medium">{todo.name}</p>
          </div>

          {todo.description && (
            <div className="flex flex-row gap-2 items-center">
              <span className="text-xs font-medium text-gray-500">תיאור</span>
              <span className="text-gray-700 text-sm whitespace-pre-wrap">{todo.description}</span>
            </div>
          )}

          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row gap-2 items-center">
              <span className="text-xs font-medium text-gray-500">סטטוס</span>
              <div>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[todo.status]}`}>
                  {STATUS_LABELS[todo.status]}
                </span>
              </div>
            </div>

            {todo.providerId && providerName && (
              <div>
                <span className="text-xs font-medium text-gray-500">ספק</span>
                <div>
                  <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-blue-200 text-blue-800">
                    {providerName}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {todo.updatedBy && (
              <div className="flex flex-row gap-1 items-center">
                <span className="text-xs font-medium text-gray-500">עודכן על ידי</span>
                <span className="text-gray-700 text-xs font-bold ">{todo.updatedBy}</span>
              </div>
            )}
            <div className="flex flex-row gap-1 items-center">
              <span className="text-xs font-medium text-gray-500">נוצר ב</span>
              <span className="text-gray-700 text-xs font-bold ">{formatDateDDMMYY(todo.createdAt)}</span>
            </div>
            {todo.reminderTimestamp > 0 && (
              <div className="flex flex-row gap-1 items-center">
                <span className="text-xs font-medium text-gray-500">תזכורת</span>
                <span className="text-gray-900 font-bold text-xs">{formatDateDDMMYYHHMM(todo.reminderTimestamp)}</span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">הערות</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              dir={languageDirection}
              placeholder="הוסף הערות..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
            סגור
          </CustomButton>
          {isDirty && (
            <CustomButton
              size={ButtonSize.SM}
              onClick={handleSave}
              icon={<FontAwesomeIcon icon={faSave} className="h-3 w-3" />}>
              שמור הערות
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoDetailModal
