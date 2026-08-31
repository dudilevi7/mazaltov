'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

interface CollapsibleContainerProps {
  title: React.ReactNode
  count?: number
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const CollapsibleContainer = ({
  title,
  count,
  defaultOpen = false,
  open,
  onOpenChange,
  actions,
  children,
  className = '',
}: CollapsibleContainerProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const isControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : uncontrolledOpen

  const setIsOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const collapsedRotate = isRtl ? 'rotate-90' : '-rotate-90'

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-w-0 cursor-pointer items-center gap-2 text-start">
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`h-3 w-3 shrink-0 text-gray-400 transition-transform ${isOpen ? '' : collapsedRotate}`}
          />
          <div className="flex min-w-0 items-center gap-2">{title}</div>
          {count != null && count > 0 && <span className="text-sm text-gray-500">({count})</span>}
        </button>
        {actions && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
      {isOpen && children != null && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default CollapsibleContainer
