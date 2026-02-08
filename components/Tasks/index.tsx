'use client'

import { useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import TodoModal, { TodoFormData } from '@/components/TodoModal'
import DeleteModal from '@/components/DeleteModal'
import { Todo, TodoStatus } from '@/types/Todo'
import TasksHeader from './header'
import TasksFilters from './filters'
import TasksContent from './content'

const Tasks = () => {
  const { todos, addTodo, updateTodo, removeTodo, languageDirection } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortByDate, setSortByDate] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus | 'all'>('all')

  const filteredTodos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const sorted = [...todos].sort((a, b) =>
      sortByDate ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    )
    const byStatus =
      selectedStatus === 'all' ? sorted : sorted.filter((todo) => todo.status === selectedStatus)
    if (!q) return byStatus
    return byStatus.filter(
      (todo) =>
        todo.name.toLowerCase().includes(q) ||
        todo.description.toLowerCase().includes(q) ||
        todo.updatedBy.toLowerCase().includes(q)
    )
  }, [todos, searchQuery, sortByDate, selectedStatus])

  const incompleteTodos = useMemo(
    () => filteredTodos.filter((t) => t.status !== TodoStatus.COMPLETED),
    [filteredTodos]
  )
  const completedTodos = useMemo(
    () => filteredTodos.filter((t) => t.status === TodoStatus.COMPLETED),
    [filteredTodos]
  )

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

  const handleSave = (data: TodoFormData) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data)
    } else {
      addTodo(data)
    }
    handleCloseModal()
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

  const handleStatusChange = (todo: Todo, newStatus: TodoStatus) => {
    updateTodo(todo.id, { status: newStatus })
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 font-sans p-6">
      <TasksHeader
        onAddClick={handleOpenCreate}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <TasksFilters
        sortByDate={sortByDate}
        onSortByDate={() => setSortByDate((p) => !p)}
        selectedStatus={selectedStatus}
        onStatusChange={(v) => setSelectedStatus(v)}
      />
      <TasksContent
        incompleteTodos={incompleteTodos}
        completedTodos={completedTodos}
        languageDirection={languageDirection}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
      />

      {isModalOpen && (
        <TodoModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} todo={editingTodo} />
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

export default Tasks
