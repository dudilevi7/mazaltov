'use client'

import { Todo, TodoStatus } from '@/types/Todo'
import TodoItem from '@/components/TodoItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { useProvidersContext } from '@/context/ProvidersContext'

const getProviderName = (providers: { id: number; name: string }[], providerId?: number): string | undefined =>
  providerId ? providers.find((p) => p.id === providerId)?.name : undefined

interface TodoListProps {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void
}

const TodoList = ({ todos, onEdit, onDelete, onStatusChange }: TodoListProps) => {
  const { languageDirection } = useAppContext()
  const { providers } = useProvidersContext()

  if (todos.length === 0) {
    return (
      <div
        className="rounded-lg bg-gray-100 p-6 text-center text-gray-500 h-screen flex flex-col items-center justify-center"
        dir={languageDirection}>
        <FontAwesomeIcon icon={faFile} className="text-gray-500 max-w-10 max-h-10" />
        <span className="text-gray-500 text-sm font-medium">אין משימות להציג.</span>
      </div>
    )
  }

  return (
    <>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </>
  )
}

export default TodoList
