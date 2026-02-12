'use client'

import { useMemo } from 'react'
import SelectDropdown, { SelectOption } from './SelectDropdown'
import { useAppContext } from '@/context/AppContext'

interface SelectDropdownWithCustomOptionProps {
  value: string
  onValueChange: (value: string) => void
  customValue: string
  onCustomValueChange: (value: string) => void
  options: SelectOption[]
  customOptionLabel?: string
  customOptionValue?: string
  placeholder?: string
  className?: string
}

const SelectDropdownWithCustomOption = ({
  value,
  onValueChange,
  customValue,
  onCustomValueChange,
  options,
  customOptionLabel = 'אחר',
  customOptionValue = '__custom__',
  placeholder = '',
  className = '',
}: SelectDropdownWithCustomOptionProps) => {
  const { languageDirection } = useAppContext()

  const extendedOptions = useMemo<SelectOption[]>(
    () => [...options, { value: customOptionValue, label: customOptionLabel }],
    [options, customOptionLabel, customOptionValue],
  )

  const isCustomSelected = value === customOptionValue

  return (
    <div className={`flex flex-col gap-2 ${className}`} dir={languageDirection}>
      <SelectDropdown
        value={value}
        onChange={onValueChange}
        options={extendedOptions}
        placeholder={placeholder}
      />
      {isCustomSelected && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomValueChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="הכנס סוג אירוע מותאם"
        />
      )}
    </div>
  )
}

export default SelectDropdownWithCustomOption

