'use client'

import { useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import TodoModal, { TodoFormData } from '@/components/TodoModal'
import DeleteModal from '@/components/DeleteModal'
import TodoDetailModal from '@/components/TodoItem/TodoDetailModal'
import { Todo, TodoStatus } from '@/types/Todo'
import TasksHeader from './header'
import TasksFilters from './filters'
import TasksContent from './content'
import ShoppingList from '@/components/ShoppingList'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useProvidersContext } from '@/context/ProvidersContext'

type TasksTab = 'tasks' | 'shopping'

const TABS: { key: TasksTab; label: string; icon: typeof faListCheck }[] = [
  { key: 'tasks', label: 'משימות', icon: faListCheck },
  { key: 'shopping', label: 'קניות', icon: faCartShopping },
]

const Tasks = () => {
  const { todos, addTodo, updateTodo, removeTodo, languageDirection, isLoadingTodos } = useAppContext()
  const [activeTab, setActiveTab] = useState<TasksTab>('tasks')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortByDate, setSortByDate] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus | 'all'>('all')
  const { providers } = useProvidersContext()

  const filteredTodos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const sorted = [...todos].sort((a, b) => (sortByDate ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
    const byStatus = selectedStatus === 'all' ? sorted : sorted.filter((todo) => todo.status === selectedStatus)
    if (!q) return byStatus
    return byStatus.filter(
      (todo) =>
        todo.name.toLowerCase().includes(q) ||
        todo.description.toLowerCase().includes(q) ||
        todo.updatedBy.toLowerCase().includes(q)
    )
  }, [todos, searchQuery, sortByDate, selectedStatus])

  const incompleteTodos = useMemo(() => filteredTodos.filter((t) => t.status !== TodoStatus.COMPLETED), [filteredTodos])
  const completedTodos = useMemo(() => filteredTodos.filter((t) => t.status === TodoStatus.COMPLETED), [filteredTodos])

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

  const handleSaveComments = async (todo: Todo, comments: string) => {
    await updateTodo(todo.id, { comments })
    setViewingTodo(null)
  }

  const getProviderName = (providerId?: number): string | undefined =>
    providerId ? providers.find((p) => p.id === providerId)?.name : undefined

  if (isLoadingTodos) {
    return <SpinnerLoader size="lg" isLoadingPage />
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans">
      <div className="mb-4 flex shrink-0 border-b border-gray-200" dir="rtl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors cursor-pointer
              ${activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
              }`}>
            <FontAwesomeIcon icon={tab.icon} className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tasks' && (
        <>
          <TasksHeader onAddClick={handleOpenCreate} searchValue={searchQuery} onSearchChange={setSearchQuery} />
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
            onView={setViewingTodo}
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

          {viewingTodo && (
            <TodoDetailModal
              todo={viewingTodo}
              providerName={getProviderName(viewingTodo.providerId)}
              onClose={() => setViewingTodo(null)}
              onSaveComments={handleSaveComments}
            />
          )}
        </>
      )}

      {activeTab === 'shopping' && <ShoppingList />}
    </div>
  )
}

export default Tasks
