'use client'

import type { Todo } from '@/types/Todo'
import { useCalendarContext } from '@/context/CalendarContext'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

interface CalendarDayTasksDisplayProps {
  onAddTask: () => void
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

const CalendarDayTasksDisplay = ({ onAddTask, onEdit, onDelete }: CalendarDayTasksDisplayProps) => {
  const { selectedDate, todosForSelectedDate } = useCalendarContext()
  const { languageDirection } = useAppContext()

  const locale = languageDirection === LanguageDirection.HEB ? 'he-IL' : 'en-US'
  const isRtl = languageDirection === LanguageDirection.HEB

  return (
    <div className="flex-1 rounded-md bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">
            {selectedDate.toLocaleDateString(locale, {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p className="text-base font-semibold text-gray-900">
            {isRtl ? 'משימות ליום זה' : 'Tasks for this day'}
          </p>
        </div>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors"
          onClick={onAddTask}>
          {isRtl ? 'הוסף משימה' : 'Add task'}
        </button>
      </div>

      {todosForSelectedDate.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
          {isRtl ? 'אין משימות לתאריך זה.' : 'No tasks for this date.'}
        </div>
      ) : (
        <ul className="mt-2 flex max-h-[340px] flex-col gap-2 overflow-auto">
          {todosForSelectedDate.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded-lg bg-white p-3 shadow-xs border border-gray-100">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{todo.name}</p>
                {todo.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{todo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                  onClick={() => onEdit(todo)}>
                  {isRtl ? 'ערוך' : 'Edit'}
                </button>
                <button
                  className="rounded-full border border-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(todo)}>
                  {isRtl ? 'מחק' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CalendarDayTasksDisplay
