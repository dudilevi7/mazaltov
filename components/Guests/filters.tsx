'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSlidersH, faTimes } from '@fortawesome/free-solid-svg-icons'
import SelectDropdown, { SelectOption } from '@/components/Shared/SelectDropdown'
import { GuestStatus } from '@/types/Guest'
import Toggle from '../Shared/Toggle'
import { useGuestsContext } from '@/context/GuestsContext'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import GuestsMoreFilters from './GuestsMoreFilters'

interface GuestsFiltersProps {
  sideFilter: SelectOption
  onSideFilterChange: (value: SelectOption) => void
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

interface FilterChipProps {
  label: string
  onRemove: () => void
}

const FilterChip = ({ label, onRemove }: FilterChipProps) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="cursor-pointer rounded-full hover:bg-indigo-200 transition-colors p-0.5"
      aria-label={`הסר מסנן ${label}`}>
      <FontAwesomeIcon icon={faTimes} className="h-2.5 w-2.5" />
    </button>
  </span>
)

const GuestsFilters = ({
  sideFilter,
  onSideFilterChange,
  sideFilterOptions,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
}: GuestsFiltersProps) => {
  const {
    showNonPhoneNumbersFilter,
    setShowNonPhoneNumbersFilter,
    veganFilter,
    setVeganFilter,
    vegetarianFilter,
    setVegetarianFilter,
    glatKosherFilter,
    setGlatKosherFilter,
    transportationFilter,
    setTransportationFilter,
  } = useGuestsContext()

  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false)

  const activeMoreFilters = [
    veganFilter && { label: 'טבעוני', onRemove: () => setVeganFilter(false) },
    vegetarianFilter && { label: 'צמחוני', onRemove: () => setVegetarianFilter(false) },
    glatKosherFilter && { label: 'גלאט כשר', onRemove: () => setGlatKosherFilter(false) },
    transportationFilter && { label: 'הסעות', onRemove: () => setTransportationFilter(false) },
  ].filter(Boolean) as { label: string; onRemove: () => void }[]

  const hasMoreFilters = activeMoreFilters.length > 0

  return (
    <>
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
        <span className="whitespace-nowrap">סטטוס:</span>
        <SelectDropdown
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
          placeholder="הכל"
          className="min-w-32"
          searchable
        />
        <span className="whitespace-nowrap">קירבה:</span>
        <SelectDropdown
          value={categoryFilter}
          onChange={onCategoryFilterChange}
          options={categoryOptions}
          placeholder="הכל"
          className="min-w-32"
          searchable
        />
        <CustomButton
          size={ButtonSize.SM}
          variant="white"
          onClick={() => setIsMoreFiltersOpen(true)}
          icon={<FontAwesomeIcon icon={faSlidersH} />}
          className={
            hasMoreFilters ? 'border-indigo-300 text-indigo-700 !bg-indigo-50 hover:bg-indigo-100' : '!bg-gray-50'
          }>
          מסננים נוספים
          {hasMoreFilters && (
            <span className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white text-xs">
              {activeMoreFilters.length}
            </span>
          )}
        </CustomButton>
        <Toggle
          enabled={showNonPhoneNumbersFilter}
          onChange={setShowNonPhoneNumbersFilter}
          label="הצג רשומות ללא טלפון"
          infoTooltip="הצג את האורחים שחסר להם מספר טלפון"
        />
        {activeMoreFilters.map(({ label, onRemove }) => (
          <FilterChip key={label} label={label} onRemove={onRemove} />
        ))}
      </div>

      <GuestsMoreFilters isOpen={isMoreFiltersOpen} onClose={() => setIsMoreFiltersOpen(false)} />
    </>
  )
}

export default GuestsFilters
