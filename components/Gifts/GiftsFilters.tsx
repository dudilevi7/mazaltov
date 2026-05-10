'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import SelectDropdown, { SelectOption } from '@/components/Shared/SelectDropdown'
import { GIFT_TYPE_OPTIONS } from './helper'
import GiftsCategoryMultiSelect from './GiftsCategoryMultiSelect'

interface GiftsFiltersProps {
  sideFilter: SelectOption
  onSideFilterChange: (value: SelectOption) => void
  sideFilterOptions: SelectOption[]
  categoryFilter: string[]
  onCategoryFilterChange: (value: string[]) => void
  categoryOptions: SelectOption[]
  typeFilter: string
  onTypeFilterChange: (value: string) => void
}

const GiftsFilters = ({
  sideFilter,
  onSideFilterChange,
  sideFilterOptions,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  typeFilter,
  onTypeFilterChange,
}: GiftsFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
      <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
      <span className="whitespace-nowrap">צד:</span>
      <SelectDropdown
        value={sideFilter.value}
        onChange={(value) =>
          onSideFilterChange(
            sideFilterOptions?.find((option) => option.value === value) ?? { value: 'all', label: 'הכל' }
          )
        }
        options={sideFilterOptions}
        placeholder="הכל"
        className="min-w-32"
        searchable
      />
      <span className="whitespace-nowrap">קירבה:</span>
      <GiftsCategoryMultiSelect
        values={categoryFilter}
        onChange={onCategoryFilterChange}
        options={categoryOptions}
        className="min-w-40"
      />
      <span className="whitespace-nowrap">סוג:</span>
      <SelectDropdown
        value={typeFilter}
        onChange={onTypeFilterChange}
        options={GIFT_TYPE_OPTIONS}
        placeholder="הכל"
        className="min-w-32"
        searchable
      />
    </div>
  )
}

export default GiftsFilters
