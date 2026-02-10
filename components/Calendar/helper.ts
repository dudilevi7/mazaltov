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
    // Treat todos without explicit flag as real tasks
    const isTask = todo.isTask !== false
    if (!isTask || !todo.reminderTimestamp) return
    const key = getDateKeyFromTimestamp(todo.reminderTimestamp)
    if (!key) return
    if (!byDate[key]) {
      byDate[key] = []
    }
    byDate[key].push(todo)
  })
  return byDate
}

