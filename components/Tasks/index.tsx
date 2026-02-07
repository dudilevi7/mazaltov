'use client'

import { useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import AppHeader from '@/components/AppHeader'
import TodoHeader from '@/components/TodoHeader'
import TodoList from '@/components/TodoList'
import TodoModal, { TodoFormData } from '@/components/TodoModal'
import DeleteModal from '@/components/DeleteModal'
import { Todo, TodoStatus } from '@/types/Todo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import SelectDropdown from '../Shared/SelectDropdown'
import { TASK_STATUS_OPTIONS } from '@/constants/options'

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
    let sortedTodos = todos.sort((a, b) => (sortByDate ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
    if (selectedStatus !== 'all') {
      sortedTodos = sortedTodos.filter((todo) => todo.status === selectedStatus)
    }
    if (!q) return sortedTodos
    let filteredTodos = sortedTodos.filter(
      (todo) =>
        todo.name.toLowerCase().includes(q) ||
        todo.description.toLowerCase().includes(q) ||
        todo.updatedBy.toLowerCase().includes(q)
    )

    return filteredTodos
  }, [todos, searchQuery, sortByDate, selectedStatus])

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

  const handleSortByDate = () => {
    setSortByDate(!sortByDate)
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 font-sans p-6">
      <div className="mb-6 flex shrink-0 flex-row items-center justify-between">
        <AppHeader />
        <TodoHeader onAddClick={handleOpenCreate} searchValue={searchQuery} onSearchChange={setSearchQuery} />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <div
          className="flex shrink-0 flex-row items-center justify-end gap-1 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={handleSortByDate}>
          <span className="">מיון לפי תאריך</span>
          <FontAwesomeIcon icon={faArrowDown} className={` ${sortByDate ? 'rotate-180' : ''} transition-all`} />
        </div>
        <SelectDropdown
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value as TodoStatus)}
          options={TASK_STATUS_OPTIONS}
          placeholder="הכל"
          className="min-w-40"
        />
      </div>
      <div className="flex flex-row">
        <span className="mx-1 mt-1 text-gray-500 text-sm font-medium hover:text-blue-600" dir={languageDirection}>
          {filteredTodos.length} {languageDirection === 'rtl' ? 'משימות' : 'Tasks'}
        </span>
      </div>
      <ul className="min-h-0 flex-1 overflow-auto py-2 px-1 flex flex-col gap-3">
        <TodoList
          todos={filteredTodos}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusChange}
        />
      </ul>

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
