'use client'

import { Switch } from '@headlessui/react'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  className?: string
}

const Toggle = ({ enabled, onChange, label, className = '' }: ToggleProps) => (
  <div className={`flex gap-2 items-center ${className}`}>
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors  ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      } transition-all duration-300`}>
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 absolute ${
          enabled ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </Switch>
    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
  </div>
)

export default Toggle
