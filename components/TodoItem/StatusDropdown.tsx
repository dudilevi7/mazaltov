'use client'

import { useRef, useState, useCallback } from 'react'
import { TodoStatus } from '@/types/Todo'
import { STATUS_LABELS, STATUS_BADGE_COLORS } from '@/constants/todoStatus'
import { useClickOutside } from '@/hooks/useClickOutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface StatusDropdownProps {
  status: TodoStatus
  onChange: (newStatus: TodoStatus) => void
}

const StatusDropdown = ({ status, onChange }: StatusDropdownProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close)

  const handleSelect = (s: TodoStatus) => {
    if (s !== status) onChange(s)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${STATUS_BADGE_COLORS[status]}`}>
        {STATUS_LABELS[status]}
        <FontAwesomeIcon icon={faChevronDown} className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full start-0 mt-1 z-20 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-fade-in">
          {Object.values(TodoStatus).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs cursor-pointer transition-colors
                ${s === status ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${STATUS_BADGE_COLORS[s].split(' ')[0]}`} />
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatusDropdown
