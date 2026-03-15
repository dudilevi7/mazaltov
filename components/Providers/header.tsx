'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import SelectDropdown, { SelectOption } from '@/components/Shared/SelectDropdown'
import { PaidFilterStatus, Provider } from '@/types/Provider'
import { paidStatusOptions } from './helper'
import { exportExpensesToExcel } from '@/components/Budget/helper'
import { useAppContext } from '@/context/AppContext'
import { useProvidersContext } from '@/context/ProvidersContext'

interface ProvidersHeaderProps {
  onAddClick: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  serviceValue: string
  onServiceChange: (value: string) => void
  serviceOptions: string[]
  rowDirectionClassName?: string
  onClearAll: () => void
  paidFilterValue: PaidFilterStatus
  onPaidFilterChange: (value: PaidFilterStatus) => void
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
  paidFilterValue,
  onPaidFilterChange,
}: ProvidersHeaderProps) => {
  const { languageDirection } = useAppContext()
  const { providers } = useProvidersContext()
  const dropdownOptions: SelectOption[] = [
    { value: '', label: 'הכל' },
    ...serviceOptions.map((service) => ({
      value: service,
      label: service,
    })),
  ]

  const hasFiltersOrSearch = serviceValue !== '' || searchValue !== '' || paidFilterValue !== PaidFilterStatus.ALL
  return (
    <div className="flex flex-col gap-3 w-full" dir={languageDirection}>
      <div className="flex flex-row items-center gap-3">
        <CustomButton onClick={onAddClick}>הוסף ספק</CustomButton>
        <SearchBar value={searchValue} onChange={onSearchChange} placeholder="חיפוש ספק" />
      </div>
      <div className={`flex flex-wrap gap-2 text-sm text-gray-700`}>
        <div className="flex flex-row items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
          <span>שירות</span>
          <SelectDropdown
            value={serviceValue}
            onChange={onServiceChange}
            options={dropdownOptions}
            placeholder="הכל"
            className="min-w-40"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-fit whitespace-nowrap">שולם/לא שולם</span>
          <SelectDropdown
            value={paidFilterValue}
            onChange={(value) => onPaidFilterChange(value as PaidFilterStatus)}
            options={paidStatusOptions}
            placeholder="הכל"
            className="min-w-40"
          />
        </div>
        {hasFiltersOrSearch && (
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            onClick={onClearAll}
            icon={<FontAwesomeIcon icon={faFilterCircleXmark} />}
            className="border border-gray-300 hover:border-gray-400 ms-2">
            נקה מסננים
          </CustomButton>
        )}
        {providers.length > 0 && (
          <div className="ms-auto">
            <CustomButton
              size={ButtonSize.SM}
              variant="white"
              className="ms-auto"
              onClick={() => exportExpensesToExcel(providers, languageDirection)}
              icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
              ייצוא לאקסל
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProvidersHeader
