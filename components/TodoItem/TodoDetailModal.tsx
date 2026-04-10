'use client'

import { useState } from 'react'
import { Todo, TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { formatDateDDMMYY, formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import { useAppContext } from '@/context/AppContext'
import { buildGoogleCalendarUrl } from '@/components/Tasks/helper'
import { STATUS_BADGE_COLORS, STATUS_LABELS } from '@/constants/todoStatus'
import Tooltip from '@/components/Tooltip'
import StatusDropdown from './StatusDropdown'

interface TodoDetailModalProps {
  todo: Todo
  providerName?: string
  onClose: () => void
  onSaveComments: (todo: Todo, comments: string) => void
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void
}

const TodoDetailModal = ({ todo, providerName, onClose, onSaveComments, onStatusChange }: TodoDetailModalProps) => {
  const { languageDirection } = useAppContext()
  const [comments, setComments] = useState(todo.comments || '')
  const isDirty = comments !== (todo.comments || '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-lg rounded-lg bg-white shadow-xl animate-fade-in max-h-[90vh] overflow-y-auto"
        dir={languageDirection}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">פרטי משימה</h2>
          <div className="flex items-center gap-2">
            <Tooltip content="הוסף לגוגל קלנדר">
              <button
                type="button"
                onClick={() =>
                  window.open(buildGoogleCalendarUrl(todo.name, todo.description, todo.reminderTimestamp), '_blank')
                }
                className="cursor-pointer rounded-md text-gray-400 hover:text-blue-500 transition-colors p-1">
                <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
              </button>
            </Tooltip>
            <button
              type="button"
              className="cursor-pointer rounded-md text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div>
            <span className="text-xs font-medium text-gray-400">שם</span>
            <p className="text-gray-900 font-semibold">{todo.name}</p>
          </div>

          {todo.description && (
            <div>
              <span className="text-xs font-medium text-gray-400">תיאור</span>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{todo.description}</p>
            </div>
          )}

          <div className="flex flex-row items-center gap-3 flex-wrap">
            <div className="flex flex-row gap-2 items-center">
              <span className="text-xs font-medium text-gray-400">סטטוס</span>
              {onStatusChange ? (
                <StatusDropdown status={todo.status} onChange={(s) => onStatusChange(todo, s)} />
              ) : (
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_COLORS[todo.status]}`}>
                  {STATUS_LABELS[todo.status]}
                </span>
              )}
            </div>
            {todo.providerId && providerName && (
              <div className="flex flex-row gap-2 items-center">
                <span className="text-xs font-medium text-gray-400">ספק</span>
                <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                  {providerName}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            {todo.updatedBy && (
              <div className="flex items-center gap-1">
                <span>עודכן על ידי</span>
                <span className="text-gray-600 font-medium">{todo.updatedBy}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>נוצר ב</span>
              <span className="text-gray-600 font-medium">{formatDateDDMMYY(todo.createdAt)}</span>
            </div>
            {todo.reminderTimestamp > 0 && (
              <div className="flex items-center gap-1">
                <span>תזכורת</span>
                <span className="text-gray-600 font-medium">{formatDateDDMMYYHHMM(todo.reminderTimestamp)}</span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">הערות</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              dir={languageDirection}
              placeholder="הוסף הערות..."
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              onClick={() => onSaveComments(todo, comments)}
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
