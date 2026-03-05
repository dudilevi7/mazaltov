'use client'

import { useState } from 'react'
import { useCalendarContext } from '@/context/CalendarContext'
import { useAppContext } from '@/context/AppContext'
import TodoModal, { TodoFormData } from '@/components/TodoModal'
import DeleteModal from '@/components/DeleteModal'
import type { Todo } from '@/types/Todo'
import { LanguageDirection } from '@/types/General'
import CalendarHeader from './header'
import CalendarSelector from './CalendarSelector'
import CalendarDayTasksDisplay from './CalendarDayTasksDisplay'

const CalendarPage = () => {
  const { selectedDate } = useCalendarContext()
  const { addTodo, updateTodo, removeTodo, languageDirection } = useAppContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)

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
        comments: data.comments || '',
        reminderTimestamp: data.reminderTimestamp || selectedDate.getTime(),
      })
    }
    closeModal()
  }

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      removeTodo(todoToDelete.id)
      setTodoToDelete(null)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans">
      <div className="flex w-full flex-col rounded-md gap-4 min-h-0 flex-1" dir={languageDirection}>
        <section className="flex flex-col gap-6 md:flex-row flex-1 min-h-0">
          <CalendarSelector />
          <CalendarDayTasksDisplay
            onAddTask={openCreateForSelectedDate}
            onEdit={openEdit}
            onDelete={(todo) => setTodoToDelete(todo)}
          />
        </section>
      </div>

      {isModalOpen && (
        <TodoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          todo={editingTodo}
          initialData={editingTodo ? undefined : { reminderTimestamp: selectedDate.getTime() }}
        />
      )}

      <DeleteModal
        isOpen={!!todoToDelete}
        onClose={() => setTodoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={todoToDelete?.name || ''}
      />
    </div>
  )
}

export default CalendarPage
