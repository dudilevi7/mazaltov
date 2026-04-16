'use client'

import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'

interface SelectOption {
  value: string
  label: string
}

interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  searchable?: boolean
  buttonClassName?: string
}

const SelectDropdown = ({
  value,
  onChange,
  options,
  placeholder = '',
  className = '',
  searchable = false,
  buttonClassName = '',
}: SelectDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const selectedOption = options.find((opt) => opt.value === value) || null
  const { languageDirection } = useAppContext()

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options
    const query = searchQuery.toLowerCase().trim()
    return options.filter((opt) => opt.label.toLowerCase().includes(query))
  }, [options, searchQuery, searchable])

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`} dir={languageDirection}>
        <Listbox.Button
          dir={languageDirection}
          className={`w-full cursor-pointer rounded-md bg-linear-to-b from-gray-50 to-gray-100 py-1.5 px-3 text-left text-sm text-gray-900 shadow-sm focus:outline-none 
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 flex flex-row gap-2 items-center hover:bg-gray-200 transition-colors ${buttonClassName}`}>
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-gray-400" aria-hidden="true" />
          <span className="block truncate">{selectedOption ? selectedOption.label : placeholder || 'בחר'}</span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setSearchQuery('')}>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden">
            {searchable && (
              <div className="sticky top-0 bg-white px-2 py-2 border-b border-gray-200">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSearchQuery(e.target.value)
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="חיפוש..."
                    className="w-full rounded-md border border-gray-300 py-1.5 pr-8 pl-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>
              </div>
            )}
            <div className="max-h-48 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-2 px-3 text-gray-500 text-center">לא נמצאו תוצאות</div>
              ) : (
                filteredOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-1.5 px-3 ${
                        active ? 'bg-blue-100 text-gray-900' : 'text-gray-900'
                      }`
                    }
                    value={option.value}>
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-medium text-blue-500' : 'font-normal'}`}>
                        {option.label}
                      </span>
                    )}
                  </Listbox.Option>
                ))
              )}
            </div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export type { SelectOption }
export default SelectDropdown
