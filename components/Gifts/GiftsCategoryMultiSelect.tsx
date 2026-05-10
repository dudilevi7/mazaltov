'use client'

import { Fragment, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import type { SelectOption } from '@/components/Shared/SelectDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'

type GiftsCategoryMultiSelectProps = {
  values: string[]
  onChange: (values: string[]) => void
  options: SelectOption[]
  className?: string
}

const GiftsCategoryMultiSelect = ({ values, onChange, options, className = '' }: GiftsCategoryMultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { languageDirection } = useAppContext()

  const selectedOptions = useMemo(() => {
    const selected = new Set(values)
    return options.filter((opt) => selected.has(opt.value))
  }, [options, values])

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return options
    return options.filter((opt) => opt.label.toLowerCase().includes(q))
  }, [options, searchQuery])

  const buttonLabel =
    selectedOptions.length === 0
      ? 'הכל'
      : selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions[0].label} +${selectedOptions.length - 1}`

  return (
    <Listbox multiple value={values} onChange={onChange}>
      <div className={`relative ${className}`} dir={languageDirection}>
        <Listbox.Button className="w-full cursor-pointer rounded-md bg-linear-to-b from-gray-50 to-gray-100 py-1.5 px-3 text-left text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 flex flex-row gap-2 items-center hover:bg-gray-200 transition-colors">
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-gray-400" aria-hidden />
          <span className="block truncate">{buttonLabel}</span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setSearchQuery('')}>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden">
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 inline-flex items-center justify-center rounded border ${
                            selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-transparent'
                          }`}>
                          <FontAwesomeIcon icon={faCheck} className="h-2.5 w-2.5" />
                        </span>
                        <span className={`block truncate ${selected ? 'font-medium text-blue-500' : 'font-normal'}`}>
                          {option.label}
                        </span>
                      </div>
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

export default GiftsCategoryMultiSelect
