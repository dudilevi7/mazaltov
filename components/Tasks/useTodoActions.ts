import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { Todo, TodoStatus } from '@/types/Todo'
import { TodoFormData } from '@/components/TodoModal'

export function useTodoActions() {
  const { addTodo, updateTodo, removeTodo } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null)

  const handleOpenCreate = () => {
    setEditingTodo(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTodo(null)
  }

  const handleSave = async (data: TodoFormData) => {
    const payload = { ...data, comments: data.comments ?? '' }
    if (editingTodo) {
      await updateTodo(editingTodo.id, payload)
    } else {
      await addTodo(payload)
    }
    handleCloseModal()
  }

  const handleStatusChange = (todo: Todo, newStatus: TodoStatus) => {
    updateTodo(todo.id, { status: newStatus })
  }

  const handleSaveComments = async (todo: Todo, comments: string) => {
    await updateTodo(todo.id, { comments })
    setViewingTodo(null)
  }

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      removeTodo(todoToDelete.id)
      setTodoToDelete(null)
    }
  }

  return {
    isModalOpen,
    editingTodo,
    todoToDelete,
    viewingTodo,
    setViewingTodo,
    setTodoToDelete,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleStatusChange,
    handleSaveComments,
    handleConfirmDelete,
  }
}
