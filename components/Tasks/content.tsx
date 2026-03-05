'use client'

import { Todo, TodoStatus } from '@/types/Todo'
import TodoList from '@/components/TodoList'
import { LanguageDirection } from '@/types/General'

interface TasksContentProps {
  incompleteTodos: Todo[]
  completedTodos: Todo[]
  languageDirection: LanguageDirection
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onStatusChange: (todo: Todo, newStatus: TodoStatus) => void
  onView: (todo: Todo) => void
}

const TASK_LABEL: Record<LanguageDirection, string> = {
  [LanguageDirection.HEB]: 'משימות',
  [LanguageDirection.ENG]: 'Tasks',
}

const COMPLETED_LABEL: Record<LanguageDirection, string> = {
  [LanguageDirection.HEB]: 'משימות שהושלמו',
  [LanguageDirection.ENG]: 'completed tasks',
}

const TasksContent = ({
  incompleteTodos,
  completedTodos,
  languageDirection,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
}: TasksContentProps) => {
  const totalCount = incompleteTodos.length + completedTodos.length

  return (
    <>
      <div className="flex flex-row">
        <span className="mx-1 mt-1 text-gray-500 text-sm font-medium hover:text-blue-600" dir={languageDirection}>
          {totalCount} {TASK_LABEL[languageDirection]}
        </span>
      </div>
      <ul className="min-h-0 flex-1 overflow-auto py-2 px-1 flex flex-col gap-3">
        {incompleteTodos.length > 0 && (
          <TodoList
            todos={incompleteTodos}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onView={onView}
          />
        )}
        {completedTodos.length > 0 && (
          <>
            <li className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-200 list-none">
              <span className="text-sm text-gray-600" dir={languageDirection}>
                {completedTodos.length} {COMPLETED_LABEL[languageDirection]}
              </span>
            </li>
            <TodoList
              todos={completedTodos}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onView={onView}
            />
          </>
        )}
        {totalCount === 0 && (
          <TodoList todos={[]} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} onView={onView} />
        )}
      </ul>
    </>
  )
}

export default TasksContent
