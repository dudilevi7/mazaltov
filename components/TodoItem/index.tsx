'use client'

import { Todo, TodoStatus } from '@/types/Todo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import { formatDateDDMMYY, formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import { useAppContext } from '@/context/AppContext'
import { getEventOwnerPhones } from '@/components/Settings/helper'
import { STATUS_BORDER_COLORS } from '@/constants/todoStatus'
import StatusDropdown from './StatusDropdown'
import WhatsAppButton from './WhatsAppButton'
import Tooltip from '@/components/Tooltip'

interface TodoItemProps {
  todo: Todo
  providerName?: string
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void
  onView?: (todo: Todo) => void
}

const TodoItem = ({ todo, providerName, onEdit, onDelete, onStatusChange, onView }: TodoItemProps) => {
  const { languageDirection, eventSettings } = useAppContext()
  const ownerPhones = getEventOwnerPhones(eventSettings)

  return (
    <li
      className={`relative flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm border border-gray-100 border-s-[3px] ${STATUS_BORDER_COLORS[todo.status]}`}
      dir={languageDirection}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex flex-row items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">{todo.name}</h3>
            {todo.providerId && providerName && (
              <span className="rounded px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                ספק - {providerName}
              </span>
            )}
          </div>
          {todo.description && <p className="text-sm text-gray-500 whitespace-pre-wrap">{todo.description}</p>}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <WhatsAppButton todo={todo} providerName={providerName} ownerPhones={ownerPhones} />
          <div className="w-px h-5 bg-gray-200" />
          <Tooltip content="צפה בפרטים">
            <button
              type="button"
              onClick={() => onView?.(todo)}
              className="rounded-md p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="ערוך">
            <button
              type="button"
              onClick={() => onEdit(todo)}
              className="rounded-md p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="מחק">
            <button
              type="button"
              onClick={() => onDelete(todo)}
              className="rounded-md p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <StatusDropdown status={todo.status} onChange={(s) => onStatusChange?.(todo, s)} />
        <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <span>{formatDateDDMMYY(todo.createdAt)}</span>
          {todo.reminderTimestamp > 0 && (
            <>
              <span className="text-gray-300">·</span>
              <span>
                תזכורת <span className="text-gray-600 font-medium">{formatDateDDMMYYHHMM(todo.reminderTimestamp)}</span>
              </span>
            </>
          )}
          {todo.updatedBy && (
            <>
              <span className="text-gray-300">·</span>
              <span>{todo.updatedBy}</span>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export default TodoItem
