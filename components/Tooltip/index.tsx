'use client'
import { useState } from 'react'

export enum TooltipPlace {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}
interface TooltipProps {
  children: React.ReactNode
  content?: React.ReactNode
  className?: string
  contentClassName?: string
  place?: TooltipPlace
}

const PLACEMENT_CLASSES: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
  left: 'right-full top-1/2 -translate-y-1/2 ms-1',
  right: 'left-full top-1/2 -translate-y-1/2 me-1',
}

const Tooltip = ({
  children,
  content,
  className = '',
  contentClassName = '',
  place = TooltipPlace.TOP,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false)

  if (!content) {
    return <>{children}</>
  }

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          className={`absolute z-80 rounded-md bg-linear-to-r from-gray-800 to-gray-900 px-3 py-2 text-sm text-white shadow-lg animate-fade-in ${PLACEMENT_CLASSES[place]} ${contentClassName || 'whitespace-nowrap w-max'}`}>
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
