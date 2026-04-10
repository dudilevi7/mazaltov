import { TodoStatus } from '@/types/Todo'

export const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'ממתין',
  [TodoStatus.IN_PROGRESS]: 'בתהליך',
  [TodoStatus.COMPLETED]: 'הושלם',
}

export const STATUS_BADGE_COLORS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'bg-gray-100 text-gray-600',
  [TodoStatus.IN_PROGRESS]: 'bg-amber-50 text-amber-700',
  [TodoStatus.COMPLETED]: 'bg-green-50 text-green-700',
}

export const STATUS_BORDER_COLORS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'border-s-gray-300',
  [TodoStatus.IN_PROGRESS]: 'border-s-amber-400',
  [TodoStatus.COMPLETED]: 'border-s-green-500',
}

export const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: TodoStatus.PENDING, label: 'ממתין' },
  { value: TodoStatus.IN_PROGRESS, label: 'בתהליך' },
  { value: TodoStatus.COMPLETED, label: 'הושלם' },
]
