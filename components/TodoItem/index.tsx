'use client'

import { useRef, useEffect, useState } from 'react'
import { Todo, TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSpinner, faCheck, faClock, faPen, faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { formatDateDDMMYY, formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import { useAppContext } from '@/context/AppContext'
import { getEventOwnerPhones } from '@/components/Settings/helper'
import { getWhatsAppUrl } from '@/components/Guests/helper'

const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'ממתין',
  [TodoStatus.IN_PROGRESS]: 'בתהליך',
  [TodoStatus.COMPLETED]: 'הושלם',
}

interface TodoItemProps {
  todo: Todo
  providerName?: string
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void
  onView?: (todo: Todo) => void
}

const TodoItem = ({ todo, providerName, onEdit, onDelete, onStatusChange, onView }: TodoItemProps) => {
  const { languageDirection, eventSettings } = useAppContext()
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const whatsappRef = useRef<HTMLDivElement>(null)
  const ownerPhones = getEventOwnerPhones(eventSettings)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (whatsappRef.current && !whatsappRef.current.contains(e.target as Node)) setWhatsappOpen(false)
    }
    if (whatsappOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [whatsappOpen])

  const openWhatsApp = (phone: string) => {
    const message = `מזכיר לגבי ${todo.name} - ${todo.description}
    ${todo.reminderTimestamp > 0 ? `תזכורת: ${formatDateDDMMYYHHMM(todo.reminderTimestamp)}` : ''}
    ${todo.providerId && providerName ? `ספק: ${providerName}` : ''}
    ${todo.updatedBy ? `עודכן על ידי: ${todo.updatedBy}` : ''}
    `
    window.open(getWhatsAppUrl(phone, message), '_blank')
    setWhatsappOpen(false)
  }

  return (
    <li
      className="relative flex items-center justify-between gap-4 rounded-lg bg-gray-100 p-4 inset-shadow-sm border border-gray-200"
      dir={languageDirection}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1.5 mb-1">
          <h3 className="font-medium text-gray-900">{todo.name}</h3>

          {todo.providerId && providerName && (
            <span className="rounded px-2 py-0.5 text-xs font-medium bg-blue-200 text-blue-800">
              ספק - {providerName}
            </span>
          )}
        </div>
        {todo.description && <p className="w-fit truncate text-sm text-gray-600">{todo.description}</p>}
        <span
          className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            todo.status === TodoStatus.COMPLETED
              ? 'bg-green-100 text-green-800'
              : todo.status === TodoStatus.IN_PROGRESS
                ? 'bg-amber-200 text-amber-800'
                : 'bg-gray-200 text-gray-800'
          }`}>
          {STATUS_LABELS[todo.status]}
        </span>
        <div className="flex flex-row items-center gap-1 text-xs text-gray-600 flex-wrap">
          <span>נוצר ב -{formatDateDDMMYY(todo.createdAt)}</span>
          {todo.reminderTimestamp > 0 && (
            <div className="flex flex-row items-center gap-1">
              <div className="border-e border-gray-500 h-4"></div>
              <div className="flex items-center gap-0.5">
                <span>תזכורת ב - </span>
                <span className="text-gray-900 font-bold">{formatDateDDMMYYHHMM(todo.reminderTimestamp)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-0.5 justify-end mb-4">
          <FontAwesomeIcon icon={faUser} className="text-gray-500" />

          <span className="text-sm text-gray-500">{todo.updatedBy} </span>
        </div>
        <div className="flex shrink-0 gap-1.5 flex-wrap">
          {ownerPhones.length > 0 && (
            <div className="relative" ref={whatsappRef}>
              <CustomButton
                size={ButtonSize.XS}
                tooltip="שלח תזכורת בוואטסאפ"
                className="!bg-linear-to-b from-white to-gray-100 !border !border-gray-200
                 !text-green-500 hover:!text-green-600"
                onClick={() =>
                  ownerPhones.length === 1 ? openWhatsApp(ownerPhones[0].phone) : setWhatsappOpen(!whatsappOpen)
                }>
                <FontAwesomeIcon icon={faWhatsapp} className="h-3 w-3" size="lg" />
              </CustomButton>
              {ownerPhones.length > 1 && whatsappOpen && (
                <div
                  className="absolute top-full right-0 mt-1 z-10 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-fade-in"
                  dir={languageDirection}>
                  {ownerPhones.map(({ label, phone }) => (
                    <button
                      key={phone}
                      type="button"
                      onClick={() => openWhatsApp(phone)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer">
                      <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366]" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {todo.status !== TodoStatus.COMPLETED && (
            <CustomButton
              size={ButtonSize.XS}
              tooltip="הושלם"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => onStatusChange?.(todo, TodoStatus.COMPLETED)}>
              <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
            </CustomButton>
          )}
          <CustomButton
            size={ButtonSize.XS}
            className="!bg-amber-200 hover:!bg-amber-300  !text-gray-900"
            tooltip="בתהליך"
            onClick={() => onStatusChange?.(todo, TodoStatus.IN_PROGRESS)}>
            <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" />
          </CustomButton>

          <div className="flex shrink-0 gap-1.5 border-r border-gray-200 pr-2">
            <CustomButton
              size={ButtonSize.XS}
              className="bg-blue-gradient !text-white hover:!text-gray-700 transition-colors duration-300 hover:scale-105"
              tooltip="צפה בפרטים"
              onClick={() => onView?.(todo)}>
              <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
            </CustomButton>
            <CustomButton size={ButtonSize.XS} onClick={() => onEdit(todo)}>
              <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
            </CustomButton>
            <CustomButton size={ButtonSize.XS} variant="red" onClick={() => onDelete(todo)}>
              <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
            </CustomButton>
          </div>
        </div>
      </div>
    </li>
  )
}

export default TodoItem
