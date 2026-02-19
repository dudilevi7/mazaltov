import type { Todo } from '@/types/Todo'

export type TaskRow = {
  id: number | string
  user_id: string
  name: string
  description: string
  status: string
  reminder_timestamp: number | null
  updated_by: string
  provider_id: number | null
  created_at: string
  updated_at: string
}

const toNum = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === 'string' ? parseInt(v, 10) : v

export const mapTaskRowToTodo = (row: TaskRow): Todo => ({
  id: toNum(row.id),
  name: row.name ?? '',
  description: row.description ?? '',
  status: row.status as Todo['status'],
  reminderTimestamp: row.reminder_timestamp ?? 0,
  updatedBy: row.updated_by ?? '',
  providerId: row.provider_id ?? undefined,
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapTodoToTaskRow = (
  todo: Partial<Todo> & { name?: string; description?: string; status?: string; reminderTimestamp?: number; updatedBy?: string }
) => ({
  name: todo.name ?? '',
  description: todo.description ?? '',
  status: todo.status ?? 'pending',
  reminder_timestamp: todo.reminderTimestamp ?? null,
  updated_by: todo.updatedBy ?? '',
  provider_id: todo.providerId ?? null,
})
