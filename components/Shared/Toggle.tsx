'use client'

import { Switch } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  infoTooltip?: React.ReactNode
  className?: string
}

const Toggle = ({ enabled, onChange, label, infoTooltip, className = '' }: ToggleProps) => (
  <div className={`flex gap-2 items-center ${className}`}>
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors  ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      } transition-all duration-300 cursor-pointer`}>
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 absolute ${
          enabled ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </Switch>
    {(label || infoTooltip) && (
      <span className="flex items-center gap-1.5">
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {infoTooltip && (
          <Tooltip
            content={infoTooltip}
            place={TooltipPlace.TOP}
            contentClassName="whitespace-normal w-max max-w-xs text-right"
            className="text-gray-400 hover:text-gray-500 cursor-help shrink-0">
            <FontAwesomeIcon icon={faInfoCircle} className="text-sm" />
          </Tooltip>
        )}
      </span>
    )}
  </div>
)

export default Toggle
