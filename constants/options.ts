import { TodoStatus } from '@/types/Todo'

const TASK_STATUS_OPTIONS = [
  { value: TodoStatus.PENDING, label: 'ממתין' },
  { value: TodoStatus.IN_PROGRESS, label: 'בתהליך' },
  { value: TodoStatus.COMPLETED, label: 'הושלם' },
  { value: 'all', label: 'הכל' },
]

export { TASK_STATUS_OPTIONS }
