'use client'

import type { TripTask } from '@/types/Trip'
import CustomCheckbox from '@/components/Shared/CustomCheckbox'
import TripItemActions from './TripItemActions'

interface TaskRowProps {
  task: TripTask
  onToggle: (checked: boolean) => void
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

const TaskRow = ({ task, onToggle, onEdit, onDelete, editLabel, deleteLabel }: TaskRowProps) => (
  <div
    className={`flex flex-col gap-2 rounded-lg border border-gray-200 p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 ${
      task.isDone ? 'bg-gray-50 opacity-70' : 'bg-white'
    }`}>
    <CustomCheckbox checked={task.isDone} onChange={onToggle} ariaLabel={task.title} />
    <span className={`min-w-0 flex-1 text-sm font-medium ${task.isDone ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
      {task.title}
    </span>
    <TripItemActions onEdit={onEdit} onDelete={onDelete} editLabel={editLabel} deleteLabel={deleteLabel} />
  </div>
)

export default TaskRow
