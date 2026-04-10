'use client'

import { Todo, TodoStatus } from '@/types/Todo'
import TodoItem from '@/components/TodoItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { useProvidersContext } from '@/context/ProvidersContext'
import { getProviderName } from '@/components/Tasks/helper'

interface TodoListProps {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void
  onView?: (todo: Todo) => void
}

const TodoList = ({ todos, onEdit, onDelete, onStatusChange, onView }: TodoListProps) => {
  const { languageDirection } = useAppContext()
  const { providers } = useProvidersContext()

  if (todos.length === 0) {
    return (
      <div
        className="rounded-lg bg-gray-50 p-6 text-center text-gray-400 flex flex-col items-center justify-center gap-2 py-16"
        dir={languageDirection}>
        <FontAwesomeIcon icon={faFile} className="text-gray-300 h-8 w-8" />
        <span className="text-sm font-medium">אין משימות להציג.</span>
      </div>
    )
  }

  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          providerName={getProviderName(providers, todo.providerId)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onView={onView}
        />
      ))}
    </>
  )
}

export default TodoList
