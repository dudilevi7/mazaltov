'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import SelectDropdown, { SelectOption } from '@/components/Shared/SelectDropdown'
import { GuestStatus } from '@/types/Guest'

interface GuestsFiltersProps {
  sideFilter: string
  onSideFilterChange: (value: string) => void
  sideFilterOptions: SelectOption[]
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categoryOptions: SelectOption[]
}

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'הכל' },
  { value: GuestStatus.PENDING, label: 'ממתין' },
  { value: GuestStatus.ACCEPTED, label: 'אישר' },
  { value: GuestStatus.DECLINED, label: 'דחה' },
]

const GuestsFilters = ({
  sideFilter,
  onSideFilterChange,
  sideFilterOptions,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
}: GuestsFiltersProps) => (
  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
    <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
    <span className="whitespace-nowrap">צד:</span>
    <SelectDropdown
      value={sideFilter}
      onChange={(value) => onSideFilterChange(sideFilterOptions.find((option) => option.value === value)?.label || '')}
      options={sideFilterOptions}
      placeholder="הכל"
      className="min-w-32"
    />
    <span className="whitespace-nowrap">סטטוס:</span>
    <SelectDropdown
      value={statusFilter}
      onChange={onStatusFilterChange}
      options={STATUS_FILTER_OPTIONS}
      placeholder="הכל"
      className="min-w-32"
    />
    <span className="whitespace-nowrap">קירבה:</span>
    <SelectDropdown
      value={categoryFilter}
      onChange={onCategoryFilterChange}
      options={categoryOptions}
      placeholder="הכל"
      className="min-w-32"
    />
  </div>
)

export default GuestsFilters
