'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBroom, faFilter } from '@fortawesome/free-solid-svg-icons'
import CustomButton from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import SelectDropdown, { SelectOption } from '@/components/Shared/SelectDropdown'

interface ProvidersHeaderProps {
  onAddClick: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  serviceValue: string
  onServiceChange: (value: string) => void
  serviceOptions: string[]
  rowDirectionClassName?: string
  onClearAll: () => void
}

const ProvidersHeader = ({
  onAddClick,
  searchValue,
  onSearchChange,
  serviceValue,
  onServiceChange,
  serviceOptions,
  rowDirectionClassName = '',
  onClearAll,
}: ProvidersHeaderProps) => {
  const dropdownOptions: SelectOption[] = [
    { value: '', label: 'הכל' },
    ...serviceOptions.map((service) => ({
      value: service,
      label: service,
    })),
  ]

  return (
    <div className="flex flex-col gap-3 relative">
      <div className="flex flex-row items-center gap-3">
        <CustomButton onClick={onAddClick}>הוסף ספק</CustomButton>
        <SearchBar value={searchValue} onChange={onSearchChange} placeholder="חיפוש ספק" />
      </div>
      <div
        className={`absolute top-14 right-0 flex items-center gap-2 text-sm text-gray-700 ${rowDirectionClassName} w-fit`}>
        <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
        <span>שירות</span>
        <SelectDropdown
          value={serviceValue}
          onChange={onServiceChange}
          options={dropdownOptions}
          placeholder="הכל"
          className="min-w-40"
        />
        <div
          className="mx-4 flex flex-row items-center gap-2 cursor-pointer justify-end
         hover:bg-gray-200 hover:text-gray-900 rounded-md p-1"
          onClick={onClearAll}>
          <span className="whitespace-nowrap">נקה הכל</span>
          <FontAwesomeIcon icon={faBroom} className="text-gray-500" />
        </div>
      </div>
    </div>
  )
}

export default ProvidersHeader
