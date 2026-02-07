'use client'

import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
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
}

const SelectDropdown = ({ value, onChange, options, placeholder = '', className = '' }: SelectDropdownProps) => {
  const selectedOption = options.find((opt) => opt.value === value) || null
  const { languageDirection } = useAppContext()
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`} dir={languageDirection}>
        <Listbox.Button
          dir={languageDirection}
          className="w-full cursor-pointer rounded-md bg-gray-100 py-1.5 px-3 text-left text-sm text-gray-900 shadow-sm focus:outline-none 
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 flex flex-row gap-2 items-center">
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-gray-400" aria-hidden="true" />
          <span className="block truncate">{selectedOption ? selectedOption.label : placeholder || 'בחר'}</span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-1.5 px-3 ${
                    active ? 'bg-blue-100 text-gray-900' : 'text-gray-900'
                  }`
                }
                value={option.value}>
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium text-blue-500' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    {/* {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-500">
                        <FontAwesomeIcon icon={faCheck} className="h-3 w-3" aria-hidden="true" />
                      </span>
                    ) : null} */}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export type { SelectOption }
export default SelectDropdown
