'use client'

import { useId } from 'react'

export interface CustomCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  id?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

const CustomCheckbox = ({ checked, onChange, label, id, ariaLabel, disabled, className = '' }: CustomCheckboxProps) => {
  const uid = useId()
  const inputId = id ?? `custom-checkbox-${uid}`

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={!label ? ariaLabel : undefined}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label ? (
        <label htmlFor={inputId} className="cursor-pointer text-sm font-medium text-gray-700 select-none">
          {label}
        </label>
      ) : null}
    </div>
  )
}

export default CustomCheckbox
