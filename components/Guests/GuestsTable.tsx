'use client'

import CustomTable, { CustomTableColumn } from '@/components/Shared/CustomTable'
import type { Guest } from '@/types/Guest'
import { getWhatsAppUrl, STATUS_LABELS } from './helper'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'
import Tooltip from '@/components/Tooltip'

interface GuestsTableProps {
  guests: Guest[]
  sideLabels: Record<string, string>
  emptyMessage?: string
  onEdit?: (guest: Guest) => void
  onDeleteGuest?: (guest: Guest) => void
}

const GuestsTable = ({
  guests,
  sideLabels,
  emptyMessage = 'אין אורחים',
  onEdit = () => {},
  onDeleteGuest = () => {},
}: GuestsTableProps) => {
  const [showDeleteSpecificGuestModal, setShowDeleteSpecificGuestModal] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)

  const onDeleteClick = (guest: Guest) => {
    setGuestToDelete(guest)
    setShowDeleteSpecificGuestModal(true)
  }
  const onDeleteConfirm = () => {
    if (guestToDelete) {
      onDeleteGuest(guestToDelete)
      setShowDeleteSpecificGuestModal(false)
      setGuestToDelete(null)
    }
  }
  const onDeleteCancel = () => {
    setShowDeleteSpecificGuestModal(false)
    setGuestToDelete(null)
  }
  const columns: CustomTableColumn<Guest>[] = [
    { key: 'name', label: 'שם' },
    { key: 'quantity', label: 'כמות' },
    {
      key: 'status',
      label: 'סטטוס',
      render: (row: Guest) => STATUS_LABELS[row.status],
    },
    {
      key: 'side',
      label: 'צד',
      render: (row: Guest) => sideLabels[row.side] ?? row.side,
    },
    {
      key: 'table',
      label: 'שולחן',
      render: (row: Guest) => (row.table !== undefined && row.table > 0 ? String(row.table) : '–'),
    },
    {
      key: 'phoneNumber',
      label: 'טלפון',
      render: (row: Guest) => row.phoneNumber || '–',
    },
    { key: 'category', label: 'קירבה' },
    { key: 'gift', label: 'מתנה', render: (row: Guest) => String(row.gift) },
    {
      key: 'manualApproval',
      label: 'אישור ידני',
      render: (row: Guest) => (row.manualApproval ? 'כן' : 'לא'),
    },
    {
      key: 'actions',
      label: '',
      render: (row: Guest) => (
        <div className="flex items-center gap-2">
          <Tooltip content="שלח הודעה בוואטסאפ" place="top">
            <a
              href={row.phoneNumber ? getWhatsAppUrl(row.phoneNumber) : undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-1 text-green-600 hover:bg-green-50 transition-colors h-8 w-8"
              aria-label="WhatsApp">
              <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
            </a>
          </Tooltip>
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            onClick={() => onEdit(row)}
            className="hover:!bg-blue-500 hover:text-white transition-colors duration-300"
            icon={<FontAwesomeIcon icon={faPen} />}>
            ערוך
          </CustomButton>
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            className="hover:bg-red-500 hover:text-white transition-colors duration-300"
            onClick={() => onDeleteClick(row)}
            icon={<FontAwesomeIcon icon={faTrash} />}>
            מחק
          </CustomButton>
        </div>
      ),
    } as CustomTableColumn<Guest>,
  ]

  return (
    <>
      <CustomTable<Guest> columns={columns} data={guests} getRowKey={(g) => g.id} emptyMessage={emptyMessage} />
      <DeleteModal
        isOpen={showDeleteSpecificGuestModal}
        onClose={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        title={`אורח ${guestToDelete?.name}`}
      />
    </>
  )
}

export default GuestsTable
