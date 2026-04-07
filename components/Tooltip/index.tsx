'use client'
import { useState, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

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

const TRANSFORM: Record<string, string> = {
  top: '-translate-x-1/2 -translate-y-full',
  bottom: '-translate-x-1/2',
  left: '-translate-x-full -translate-y-1/2',
  right: '-translate-y-1/2',
}

const GAP = 6

function getPosition(rect: DOMRect, place: TooltipPlace) {
  switch (place) {
    case TooltipPlace.TOP:
      return { top: rect.top - GAP, left: rect.left + rect.width / 2 }
    case TooltipPlace.BOTTOM:
      return { top: rect.bottom + GAP, left: rect.left + rect.width / 2 }
    case TooltipPlace.LEFT:
      return { top: rect.top + rect.height / 2, left: rect.left - GAP }
    case TooltipPlace.RIGHT:
      return { top: rect.top + rect.height / 2, left: rect.right + GAP }
  }
}

const Tooltip = ({
  children,
  content,
  className = '',
  contentClassName = '',
  place = TooltipPlace.TOP,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (visible && triggerRef.current) {
      setPos(getPosition(triggerRef.current.getBoundingClientRect(), place))
    }
  }, [visible, place])

  if (!content) {
    return <>{children}</>
  }

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {children}
      {visible &&
        createPortal(
          <div
            style={{ top: pos.top, left: pos.left }}
            className={`fixed ${TRANSFORM[place]} z-9999 rounded-md bg-linear-to-r from-gray-800 to-gray-900 px-3 py-2 text-sm text-white shadow-lg animate-fade-in pointer-events-none ${contentClassName || 'whitespace-nowrap w-max'}`}>
            {content}
          </div>,
          document.body
        )}
    </div>
  )
}

export default Tooltip
