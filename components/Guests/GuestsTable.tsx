'use client'

import CustomTable, { CustomTableColumn } from '@/components/Shared/CustomTable'
import type { Guest } from '@/types/Guest'
import { STATUS_LABELS } from './helper'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Toggle from '@/components/Shared/Toggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useMemo, useState } from 'react'
import DeleteModal from '../DeleteModal'
import Tooltip from '@/components/Tooltip'
import { useGiftsContext } from '@/context/GiftsContext'
import GuestGiftCell from './GuestGiftCell'
import WhatsAppInvitationModal from './WhatsAppInvitation'

interface GuestsTableProps {
  guests: Guest[]
  sideLabels: Record<string, string>
  emptyMessage?: string
  invitationUrl?: string | null
  onEdit?: (guest: Guest) => void
  onDeleteGuest?: (guest: Guest) => void
  onToggleManualApproval?: (guest: Guest, value: boolean) => void
}

const GuestsTable = ({
  guests,
  sideLabels,
  emptyMessage = 'אין אורחים',
  invitationUrl = null,
  onEdit = () => {},
  onDeleteGuest = () => {},
  onToggleManualApproval = () => {},
}: GuestsTableProps) => {
  const { gifts } = useGiftsContext()
  const [showDeleteSpecificGuestModal, setShowDeleteSpecificGuestModal] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [guestForWhatsApp, setGuestForWhatsApp] = useState<Guest | null>(null)
  const giftsIdAndAmountByGuestId = useMemo(() => {
    const map: Record<number, { giftId: string; amount: number }> = {}
    gifts.forEach((gift) => {
      const { guestId, amount, id: giftId } = gift
      if (guestId && amount > 0) {
        map[guestId] = {
          giftId: giftId.toString(),
          amount,
        }
      }
    })
    return map
  }, [gifts])

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
    {
      key: 'gift',
      label: 'מתנה',
      render: (row: Guest) => (
        <GuestGiftCell
          guest={row}
          amount={giftsIdAndAmountByGuestId[row.id]?.amount ?? 0}
          giftId={giftsIdAndAmountByGuestId[row.id]?.giftId}
        />
      ),
    },
    {
      key: 'manualApproval',
      label: 'אישור ידני',
      render: (row: Guest) => (
        <Toggle enabled={row.manualApproval} onChange={(value) => onToggleManualApproval(row, value)} />
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row: Guest) => (
        <div className="flex items-center gap-2">
          <Tooltip content="שלח הודעה בוואטסאפ" place="top">
            <button
              type="button"
              onClick={() => setGuestForWhatsApp(row)}
              className={`inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-2 text-green-600
               hover:bg-green-50 transition-colors h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed ${
                 !row.phoneNumber ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
               }`}
              aria-label="WhatsApp"
              disabled={!row.phoneNumber}>
              <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
            </button>
          </Tooltip>
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            onClick={() => onEdit(row)}
            className="hover:bg-blue-500! hover:text-white transition-colors duration-300 cursor-pointer"
            icon={<FontAwesomeIcon icon={faPen} />}>
            ערוך
          </CustomButton>
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            className="hover:bg-red-500 hover:text-white transition-colors duration-300 cursor-pointer"
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
      <WhatsAppInvitationModal
        isOpen={!!guestForWhatsApp}
        onClose={() => setGuestForWhatsApp(null)}
        guest={guestForWhatsApp}
        invitationUrl={invitationUrl}
      />
    </>
  )
}

export default GuestsTable
