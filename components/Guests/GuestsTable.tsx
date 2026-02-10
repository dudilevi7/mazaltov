'use client'

import CustomTable, { CustomTableColumn } from '@/components/Shared/CustomTable'
import type { Guest } from '@/types/Guest'
import { SIDE_LABELS, STATUS_LABELS } from './helper'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import DeleteModal from '../DeleteModal'

interface GuestsTableProps {
  guests: Guest[]
  emptyMessage?: string
  onEdit?: (guest: Guest) => void
  onDeleteGuest?: (guest: Guest) => void
}

const GuestsTable = ({
  guests,
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
      render: (row: Guest) => SIDE_LABELS[row.side],
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
        onClose={() => setShowDeleteSpecificGuestModal(false)}
        onConfirm={onDeleteConfirm}
        title={`אורח ${guestToDelete?.name}`}
      />
    </>
  )
}

export default GuestsTable
