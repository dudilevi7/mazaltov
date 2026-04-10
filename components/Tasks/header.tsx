'use client'

import TodoHeader from '@/components/TodoHeader'

interface TasksHeaderProps {
  onAddClick: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const TasksHeader = ({ onAddClick, searchValue, onSearchChange }: TasksHeaderProps) => (
  <div className="mb-4 flex shrink-0 flex-row items-center justify-end flex-wrap gap-2">
    <TodoHeader onAddClick={onAddClick} searchValue={searchValue} onSearchChange={onSearchChange} />
  </div>
)

export default TasksHeader
