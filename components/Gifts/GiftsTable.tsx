'use client'

import CustomTable, { CustomTableColumn } from '@/components/Shared/CustomTable'
import type { Gift } from '@/types/Gift'
import { GIFT_TYPE_LABELS, GIFT_TYPE_COLORS, formatCurrency } from './helper'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react'
import DeleteModal from '../DeleteModal'
import moment from 'moment'
import { useGuestsContext } from '@/context/GuestsContext'

interface GiftsTableProps {
  gifts: Gift[]
  sideLabels: Record<string, string>
  emptyMessage?: string
  onEdit?: (gift: Gift) => void
  onDeleteGift?: (gift: Gift) => void
}

const GiftsTable = ({
  gifts,
  sideLabels,
  emptyMessage = 'אין מתנות',
  onEdit = () => {},
  onDeleteGift = () => {},
}: GiftsTableProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [giftToDelete, setGiftToDelete] = useState<Gift | null>(null)

  const onDeleteClick = (gift: Gift) => {
    setGiftToDelete(gift)
    setShowDeleteModal(true)
  }
  const onDeleteConfirm = () => {
    if (giftToDelete) {
      onDeleteGift(giftToDelete)
      setShowDeleteModal(false)
      setGiftToDelete(null)
    }
  }
  const onDeleteCancel = () => {
    setShowDeleteModal(false)
    setGiftToDelete(null)
  }

  const columns: CustomTableColumn<Gift>[] = [
    { key: 'guestName', label: 'שם אורח' },
    {
      key: 'guestSide',
      label: 'צד',
      render: (row: Gift) => sideLabels[row.guestSide] ?? row.guestSide,
    },
    { key: 'guestCategory', label: 'קירבה' },
    {
      key: 'amount',
      label: 'סכום',
      render: (row: Gift) => formatCurrency(row.amount),
    },
    {
      key: 'type',
      label: 'סוג',
      render: (row: Gift) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${GIFT_TYPE_COLORS[row.type] ?? 'bg-gray-100 text-gray-800'}`}>
          {GIFT_TYPE_LABELS[row.type] ?? row.type}
        </span>
      ),
    },
    { key: 'description', label: 'תיאור' },
    {
      key: 'updatedAt',
      label: 'עודכן',
      render: (row: Gift) => (row.updatedAt ? moment(row.updatedAt).format('DD/MM/YYYY') : '–'),
    },
    {
      key: 'actions',
      label: '',
      render: (row: Gift) => (
        <div className="flex items-center gap-2">
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            onClick={() => onEdit(row)}
            className="hover:bg-blue-500! hover:text-white transition-colors duration-300"
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
    } as CustomTableColumn<Gift>,
  ]

  return (
    <>
      <CustomTable<Gift> columns={columns} data={gifts} getRowKey={(g) => g.id} emptyMessage={emptyMessage} />
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        title={`מתנה של ${giftToDelete?.guestName}`}
      />
    </>
  )
}

export default GiftsTable
