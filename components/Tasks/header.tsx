'use client'

import AppHeader from '@/components/AppHeader'
import TodoHeader from '@/components/TodoHeader'

interface TasksHeaderProps {
  onAddClick: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const TasksHeader = ({ onAddClick, searchValue, onSearchChange }: TasksHeaderProps) => (
  <div className="mb-6 flex shrink-0 flex-row items-center justify-between">
    <AppHeader />
    <TodoHeader onAddClick={onAddClick} searchValue={searchValue} onSearchChange={onSearchChange} />
  </div>
)

export default TasksHeader
