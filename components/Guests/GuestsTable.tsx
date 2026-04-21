'use client'

import CustomTable, { CustomTableColumn } from '@/components/Shared/CustomTable'
import type { Guest } from '@/types/Guest'
import { GuestStatus } from '@/types/Guest'
import { STATUS_OPTIONS } from './helper'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import CustomCheckbox from '@/components/Shared/CustomCheckbox'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useMemo, useState, useRef } from 'react'
import DeleteModal from '../DeleteModal'
import Tooltip, { TooltipPlace } from '@/components/Tooltip'
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
  onStatusChange?: (guest: Guest, status: GuestStatus) => void
  onNotesChange?: (guest: Guest, notes: string) => void
  onBooleanFieldChange?: (guest: Guest, field: 'vegan' | 'vegetarian' | 'glatKosher' | 'transportation', value: boolean) => void
}

const InlineNotesCell = ({
  guest,
  onNotesChange,
}: {
  guest: Guest
  onNotesChange: (guest: Guest, notes: string) => void
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(guest.notes ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    setValue(guest.notes ?? '')
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleBlur = () => {
    setEditing(false)
    if (value !== (guest.notes ?? '')) {
      onNotesChange(guest, value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') inputRef.current?.blur()
    if (e.key === 'Escape') {
      setValue(guest.notes ?? '')
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        dir="rtl"
        className="w-full min-w-[120px] rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    )
  }

  return (
    <Tooltip content={guest.notes ? 'לחץ לעריכה' : 'לחץ להוספת הערה'} place={TooltipPlace.TOP}>
      <span
        onClick={handleClick}
        className="block min-w-[80px] cursor-pointer rounded px-1 py-0.5 text-sm hover:bg-gray-100 truncate max-w-[150px]"
        title={guest.notes}>
        {guest.notes || <span className="text-gray-300">–</span>}
      </span>
    </Tooltip>
  )
}

const GuestsTable = ({
  guests,
  sideLabels,
  emptyMessage = 'אין אורחים',
  invitationUrl = null,
  onEdit = () => {},
  onDeleteGuest = () => {},
  onToggleManualApproval = () => {},
  onStatusChange = () => {},
  onNotesChange = () => {},
  onBooleanFieldChange = () => {},
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
      render: (row: Guest) => (
        <SelectDropdown
          value={row.status}
          onChange={(v) => onStatusChange(row, v as GuestStatus)}
          options={STATUS_OPTIONS}
          buttonClassName="!bg-linear-to-b from-white to-white !shadow-none border border-gray-200"
          className="min-w-[100px]"
        />
      ),
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
      key: 'notes',
      label: 'הערות',
      render: (row: Guest) => <InlineNotesCell guest={row} onNotesChange={onNotesChange} />,
    },
    {
      key: 'vegan',
      label: 'טבעוני',
      render: (row: Guest) => (
        <div className="flex justify-center">
          <CustomCheckbox
            checked={row.vegan ?? false}
            onChange={(value) => onBooleanFieldChange(row, 'vegan', value)}
            ariaLabel={`טבעוני, ${row.name}`}
          />
        </div>
      ),
    },
    {
      key: 'vegetarian',
      label: 'צמחוני',
      render: (row: Guest) => (
        <div className="flex justify-center">
          <CustomCheckbox
            checked={row.vegetarian ?? false}
            onChange={(value) => onBooleanFieldChange(row, 'vegetarian', value)}
            ariaLabel={`צמחוני, ${row.name}`}
          />
        </div>
      ),
    },
    {
      key: 'glatKosher',
      label: 'גלאט כשר',
      render: (row: Guest) => (
        <div className="flex justify-center">
          <CustomCheckbox
            checked={row.glatKosher ?? false}
            onChange={(value) => onBooleanFieldChange(row, 'glatKosher', value)}
            ariaLabel={`גלאט כשר, ${row.name}`}
          />
        </div>
      ),
    },
    {
      key: 'transportation',
      label: 'הסעות',
      render: (row: Guest) => (
        <div className="flex justify-center">
          <CustomCheckbox
            checked={row.transportation ?? false}
            onChange={(value) => onBooleanFieldChange(row, 'transportation', value)}
            ariaLabel={`הסעות, ${row.name}`}
          />
        </div>
      ),
    },
    {
      key: 'manualApproval',
      label: 'אישור ידני',
      render: (row: Guest) => (
        <div className="flex justify-center">
          <CustomCheckbox
            checked={row.manualApproval ?? false}
            onChange={(value) => onToggleManualApproval(row, value)}
            ariaLabel={`אישור ידני, ${row.name}`}
          />
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row: Guest) => (
        <div className="flex items-center gap-2">
          <Tooltip content="שלח הודעה בוואטסאפ" place={TooltipPlace.TOP}>
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
