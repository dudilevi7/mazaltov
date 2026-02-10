'use client'

import { TodoStatus } from '@/types/Todo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import { TASK_STATUS_OPTIONS } from '@/constants/options'

interface TasksFiltersProps {
  sortByDate: boolean
  onSortByDate: () => void
  selectedStatus: TodoStatus | 'all'
  onStatusChange: (value: TodoStatus | 'all') => void
}

const TasksFilters = ({ sortByDate, onSortByDate, selectedStatus, onStatusChange }: TasksFiltersProps) => (
  <div className="flex flex-row items-center justify-end gap-2">
    <div
      className="flex shrink-0 flex-row items-center justify-end gap-1 text-gray-500 hover:text-gray-700 cursor-pointer"
      onClick={onSortByDate}>
      <span>מיון לפי תאריך</span>
      <FontAwesomeIcon
        icon={faArrowDown}
        className={`${sortByDate ? 'rotate-180' : ''} transition-all max-w-4 max-h-4`}
      />
    </div>
    <SelectDropdown
      value={selectedStatus}
      onChange={(value) => onStatusChange(value as TodoStatus | 'all')}
      options={TASK_STATUS_OPTIONS}
      placeholder="הכל"
      className="min-w-40"
    />
  </div>
)

export default TasksFilters
