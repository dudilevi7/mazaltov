'use client'
import { Todo, TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Tooltip from '@/components/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSpinner, faCheck, faClock } from '@fortawesome/free-solid-svg-icons'
import { formatDateDDMMYY, formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import { useAppContext } from '@/context/AppContext'

const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'ממתין',
  [TodoStatus.IN_PROGRESS]: 'בתהליך',
  [TodoStatus.COMPLETED]: 'הושלם',
}

interface TodoItemProps {
  todo: Todo
  providerName?: string
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void
}

const TodoItem = ({ todo, providerName, onEdit, onDelete, onStatusChange }: TodoItemProps) => {
  const { languageDirection } = useAppContext()
  return (
    <li
      className="relative flex items-center justify-between gap-4 rounded-lg bg-gray-100 p-4 inset-shadow-sm shadow-gray-500"
      dir={languageDirection}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1.5 mb-1">
          <h3 className="font-medium text-gray-900">{todo.name}</h3>

          {todo.providerId && providerName && (
            <span className="rounded px-2 py-0.5 text-xs font-medium bg-blue-200 text-blue-800">
              ספק - {providerName}
            </span>
          )}
        </div>
        {todo.description && <p className="w-fit truncate text-sm text-gray-600">{todo.description}</p>}
        <span
          className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            todo.status === TodoStatus.COMPLETED
              ? 'bg-green-100 text-green-800'
              : todo.status === TodoStatus.IN_PROGRESS
                ? 'bg-amber-200 text-amber-800'
                : 'bg-gray-200 text-gray-800'
          }`}>
          {STATUS_LABELS[todo.status]}
        </span>
        <div className="flex flex-row items-center gap-1 text-xs text-gray-600">
          <span>{formatDateDDMMYY(todo.createdAt)}</span>
          {todo.reminderTimestamp > 0 && (
            <Tooltip content={formatDateDDMMYYHHMM(todo.reminderTimestamp)}>
              <div className="flex items-center gap-0.5">
                <span>תזכורת</span>
                <FontAwesomeIcon icon={faClock} className="text-gray-500" />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-0.5 justify-end mb-4">
          <FontAwesomeIcon icon={faUser} className="text-gray-500" />

          <span className="text-sm text-gray-500">{todo.updatedBy} </span>
        </div>
        <div className="flex shrink-0 gap-2">
          {todo.status !== TodoStatus.COMPLETED && (
            <CustomButton
              size={ButtonSize.SM}
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => onStatusChange?.(todo, TodoStatus.COMPLETED)}>
              <FontAwesomeIcon icon={faCheck} className="mr-1" />
              הושלם
            </CustomButton>
          )}
          <CustomButton
            size={ButtonSize.SM}
            className="!bg-amber-200 hover:!bg-amber-300 !text-gray-900"
            onClick={() => onStatusChange?.(todo, TodoStatus.IN_PROGRESS)}>
            <FontAwesomeIcon icon={faSpinner} className="mr-1" />
            בתהליך
          </CustomButton>
          <CustomButton size={ButtonSize.SM} onClick={() => onEdit(todo)}>
            ערוך
          </CustomButton>
          <CustomButton size={ButtonSize.SM} variant="red" onClick={() => onDelete(todo)}>
            מחק
          </CustomButton>
        </div>
      </div>
    </li>
  )
}

export default TodoItem
