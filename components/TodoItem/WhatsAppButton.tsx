'use client'

import { useRef, useState, useCallback } from 'react'
import { Todo } from '@/types/Todo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import { getWhatsAppUrl } from '@/components/Guests/helper'
import { useClickOutside } from '@/hooks/useClickOutside'
import Tooltip from '@/components/Tooltip'

interface OwnerPhone {
  label: string
  phone: string
}

interface WhatsAppButtonProps {
  todo: Todo
  providerName?: string
  ownerPhones: OwnerPhone[]
}

const buildMessage = (todo: Todo, providerName?: string): string => {
  const lines = [`מזכיר לגבי ${todo.name} - ${todo.description}`]
  if (todo.reminderTimestamp > 0) lines.push(`תזכורת: ${formatDateDDMMYYHHMM(todo.reminderTimestamp)}`)
  if (todo.providerId && providerName) lines.push(`ספק: ${providerName}`)
  if (todo.updatedBy) lines.push(`עודכן על ידי: ${todo.updatedBy}`)
  return lines.join('\n')
}

const WhatsAppButton = ({ todo, providerName, ownerPhones }: WhatsAppButtonProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useClickOutside(ref, close)

  const send = (phone: string) => {
    window.open(getWhatsAppUrl(phone, buildMessage(todo, providerName)), '_blank')
    setOpen(false)
  }

  if (ownerPhones.length === 0) return null

  return (
    <div className="relative" ref={ref}>
      <Tooltip content="שלח תזכורת בוואטסאפ">
        <button
          type="button"
          onClick={() => (ownerPhones.length === 1 ? send(ownerPhones[0].phone) : setOpen(!open))}
          className="rounded-md p-2 text-green-500 hover:bg-gray-100 transition-colors cursor-pointer">
          <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
        </button>
      </Tooltip>
      {ownerPhones.length > 1 && open && (
        <div className="absolute top-full end-0 mt-1 z-20 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-fade-in">
          {ownerPhones.map(({ label, phone }) => (
            <button
              key={phone}
              type="button"
              onClick={() => send(phone)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366]" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WhatsAppButton
