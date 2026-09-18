'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import SelectDropdown, { type SelectOption } from '@/components/Shared/SelectDropdown'
import { ALL_LOCATIONS } from './helper'

interface TripLocationFilterProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label: string
  allLabel: string
}

const TripLocationFilter = ({ value, onChange, options, label, allLabel }: TripLocationFilterProps) => {
  const filterOptions: SelectOption[] = [{ value: ALL_LOCATIONS, label: allLabel }, ...options]

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
      <FontAwesomeIcon icon={faFilter} className="text-gray-500" aria-hidden />
      <span className="whitespace-nowrap">{label}:</span>
      <SelectDropdown
        value={value}
        onChange={onChange}
        options={filterOptions}
        placeholder={allLabel}
        className="min-w-32"
        searchable
      />
    </div>
  )
}

export default TripLocationFilter
