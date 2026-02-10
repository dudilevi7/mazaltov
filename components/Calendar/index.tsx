'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import { useCalendarContext } from '@/context/CalendarContext'
import { useAppContext } from '@/context/AppContext'
import TodoModal, { TodoFormData } from '@/components/TodoModal'
import DeleteModal from '@/components/DeleteModal'
import type { Todo } from '@/types/Todo'
import { LanguageDirection } from '@/types/General'
import { getDateKey, getTileClassName } from './helper'
import AppHeader from '../AppHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CalendarPage = () => {
  const { selectedDate, setSelectedDate, todosByDate, todosForSelectedDate } = useCalendarContext()
  const { addTodo, updateTodo, removeTodo, languageDirection } = useAppContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)

  const locale = languageDirection === LanguageDirection.HEB ? 'he-IL' : 'en-US'
  const isRtl = languageDirection === LanguageDirection.HEB

  const openCreateForSelectedDate = () => {
    setEditingTodo(null)
    setIsModalOpen(true)
  }

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTodo(null)
  }

  const handleSave = (data: TodoFormData) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data)
    } else {
      addTodo({
        ...data,
        reminderTimestamp: data.reminderTimestamp || selectedDate.getTime(),
      })
    }
    closeModal()
  }

  const handleDayClick = (value: Date) => {
    if (value instanceof Date) {
      setSelectedDate(value)
    }
  }

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo)
  }

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      removeTodo(todoToDelete.id)
      setTodoToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setTodoToDelete(null)
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans p-6">
      <div className="flex shrink-0 flex-row items-center justify-between">
        <AppHeader />
      </div>
      <div className="flex w-full flex-col rounded-md p-4 gap-4" dir={languageDirection}>
        <div className="flex flex-row items-center gap-1 w-fit rounded-md">
          <FontAwesomeIcon icon={faCalendar} className="text-lg text-gray-700" />
          <span className="text-base font-semibold text-gray-700">לוח שנה</span>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex justify-center md:w-4/6">
            <Calendar
              onChange={(value) => handleDayClick(value as Date)}
              value={selectedDate}
              locale={locale}
              prev2Label={null}
              next2Label={null}
              nextLabel={
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs"
                />
              }
              prevLabel={
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs"
                />
              }
              navigationLabel={({ label }) => {
                return <span className="text-base font-semibold text-gray-800">{label}</span>
              }}
              defaultView="month"
              calendarType={languageDirection === LanguageDirection.HEB ? 'hebrew' : 'gregory'}
              onClickDay={handleDayClick}
              className={`rounded-md border border-gray-200 bg-white p-4 shadow-sm`}
              tileClassName={({ date }) => getTileClassName({ date, todosByDate, selectedDate })}
            />
          </div>

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
                onClick={openCreateForSelectedDate}>
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
                        onClick={() => openEdit(todo)}>
                        {isRtl ? 'ערוך' : 'Edit'}
                      </button>
                      <button
                        className="rounded-full border border-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(todo)}>
                        {isRtl ? 'מחק' : 'Delete'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TodoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          todo={editingTodo}
          initialData={
            editingTodo
              ? undefined
              : {
                  reminderTimestamp: selectedDate.getTime(),
                }
          }
        />
      )}

      <DeleteModal
        isOpen={!!todoToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={todoToDelete?.name || ''}
      />
    </div>
  )
}

export default CalendarPage
