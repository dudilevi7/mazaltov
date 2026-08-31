'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'

export enum ActionButtonSize {
  SM = 'sm',
  MD = 'md',
}

export enum ActionButtonVariant {
  DEFAULT = 'default',
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
}

const variantStyles: Record<ActionButtonVariant, string> = {
  [ActionButtonVariant.DEFAULT]: 'text-gray-400 hover:text-gray-700 hover:bg-gray-100',
  [ActionButtonVariant.EDIT]: 'text-gray-400 hover:text-blue-500 hover:bg-blue-50',
  [ActionButtonVariant.DELETE]: 'text-gray-400 hover:text-red-500 hover:bg-red-50',
  [ActionButtonVariant.VIEW]: 'text-gray-400 hover:text-blue-500 hover:bg-gray-50',
}

const sizeStyles: Record<ActionButtonSize, { button: string; icon: string }> = {
  [ActionButtonSize.SM]: { button: 'h-7 w-7', icon: 'h-3 w-3' },
  [ActionButtonSize.MD]: { button: 'h-8 w-8', icon: 'h-3.5 w-3.5' },
}

interface ActionButtonProps {
  icon: IconDefinition
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  tooltip?: string
  variant?: ActionButtonVariant
  size?: ActionButtonSize
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

const ActionButton = ({
  icon,
  onClick,
  tooltip,
  variant = ActionButtonVariant.DEFAULT,
  size = ActionButtonSize.SM,
  disabled = false,
  className = '',
  ariaLabel,
}: ActionButtonProps) => {
  const sizeStyle = sizeStyles[size]

  return (
    <Tooltip content={tooltip} place={TooltipPlace.TOP}>
      <button
        type="button"
        aria-label={ariaLabel ?? tooltip}
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyle.button} ${className}`}>
        <FontAwesomeIcon icon={icon} className={sizeStyle.icon} />
      </button>
    </Tooltip>
  )
}

export default ActionButton
