'use client'
import { useId } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

interface TooltipProps {
  children: React.ReactNode
  content?: string
  htmlContent?: string
  className?: string
  place?: 'top' | 'right' | 'bottom' | 'left'
}

const Tooltip = ({ children, content, htmlContent, className = '', place = 'top' }: TooltipProps) => {
  const id = useId().replace(/:/g, '-')
  const hasContent = !!content || !!htmlContent

  return (
    <>
      <div
        data-tooltip-id={id}
        {...(htmlContent ? { 'data-tooltip-html': htmlContent } : { 'data-tooltip-content': content })}
        data-tooltip-place={place}
        className={`inline-flex items-center cursor-help ${className}`}>
        {children}
      </div>
      {hasContent && <ReactTooltip id={id} className="z-50" />}
    </>
  )
}

export default Tooltip
