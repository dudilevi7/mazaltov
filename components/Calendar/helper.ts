import type { Todo } from '@/types/Todo'

export const getDateKey = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('/', '-')

export const getDateKeyFromTimestamp = (timestamp: number): string => {
  if (!timestamp) return ''
  return getDateKey(new Date(timestamp))
}

export const getTodosByDate = (todos: Todo[]): Record<string, Todo[]> => {
  const byDate: Record<string, Todo[]> = {}
  todos.forEach((todo) => {
    if (!todo.reminderTimestamp) return
    const key = getDateKeyFromTimestamp(todo.reminderTimestamp)
    if (!key) return
    if (!byDate[key]) {
      byDate[key] = []
    }
    byDate[key].push(todo)
  })
  return byDate
}

export const getTileClassName = ({
  date,
  todosByDate,
  selectedDate,
}: {
  date: Date
  todosByDate: Record<string, Todo[]>
  selectedDate: Date
}): string => {
  const key = getDateKey(date)
  const hasTodos = !!todosByDate[key]?.length
  const isSelected = getDateKey(selectedDate) === key

  let base =
    'relative flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-md text-sm transition-colors cursor-pointer'

  if (isSelected) {
    base += ' bg-blue-500 text-white shadow-md'
  } else if (hasTodos) {
    base += ' bg-blue-50 text-blue-600 hover:bg-blue-100'
  } else {
    base += ' text-gray-700 hover:bg-gray-100'
  }

  return base
}
