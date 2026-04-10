'use client'

import { useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import TodoModal from '@/components/TodoModal'
import DeleteModal from '@/components/DeleteModal'
import TodoDetailModal from '@/components/TodoItem/TodoDetailModal'
import { TodoStatus } from '@/types/Todo'
import TasksHeader from './header'
import TasksFilters from './filters'
import TasksContent from './content'
import TasksTabBar, { type TasksTab } from './TasksTabBar'
import ShoppingList from '@/components/ShoppingList'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import { useProvidersContext } from '@/context/ProvidersContext'
import { getProviderName } from './helper'
import { useTodoActions } from './useTodoActions'

const Tasks = () => {
  const { todos, languageDirection, isLoadingTodos } = useAppContext()
  const { providers } = useProvidersContext()
  const [activeTab, setActiveTab] = useState<TasksTab>('tasks')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortByDate, setSortByDate] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus | 'all'>('all')

  const {
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
  } = useTodoActions()

  const filteredTodos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const sorted = [...todos].sort((a, b) => (sortByDate ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
    const byStatus = selectedStatus === 'all' ? sorted : sorted.filter((t) => t.status === selectedStatus)
    if (!q) return byStatus
    return byStatus.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.updatedBy.toLowerCase().includes(q)
    )
  }, [todos, searchQuery, sortByDate, selectedStatus])

  const incompleteTodos = useMemo(() => filteredTodos.filter((t) => t.status !== TodoStatus.COMPLETED), [filteredTodos])
  const completedTodos = useMemo(() => filteredTodos.filter((t) => t.status === TodoStatus.COMPLETED), [filteredTodos])

  if (isLoadingTodos) return <SpinnerLoader size="lg" isLoadingPage />

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-sans">
      <TasksTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'tasks' && (
        <>
          <TasksHeader onAddClick={handleOpenCreate} searchValue={searchQuery} onSearchChange={setSearchQuery} />
          <TasksFilters
            sortByDate={sortByDate}
            onSortByDate={() => setSortByDate((p) => !p)}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
          <TasksContent
            incompleteTodos={incompleteTodos}
            completedTodos={completedTodos}
            languageDirection={languageDirection}
            onEdit={handleOpenEdit}
            onDelete={setTodoToDelete}
            onStatusChange={handleStatusChange}
            onView={setViewingTodo}
          />

          {isModalOpen && (
            <TodoModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} todo={editingTodo} />
          )}

          <DeleteModal
            isOpen={!!todoToDelete}
            onClose={() => setTodoToDelete(null)}
            onConfirm={handleConfirmDelete}
            title={todoToDelete?.name || ''}
          />

          {viewingTodo && (
            <TodoDetailModal
              todo={viewingTodo}
              providerName={getProviderName(providers, viewingTodo.providerId)}
              onClose={() => setViewingTodo(null)}
              onSaveComments={handleSaveComments}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}

      {activeTab === 'shopping' && <ShoppingList />}
    </div>
  )
}

export default Tasks
