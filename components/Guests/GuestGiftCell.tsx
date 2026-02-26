'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Guest } from '@/types/Guest'
import { useGiftsContext } from '@/context/GiftsContext'
import { GiftType } from '@/types/Gift'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface GuestGiftCellProps {
  guest: Guest
  amount: number
  giftId?: string
}

const GuestGiftCell = ({ guest, amount, giftId }: GuestGiftCellProps) => {
  const { addGift, updateGift } = useGiftsContext()
  const [isGiftUpdating, setIsGiftUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(String(amount))

  useEffect(() => {
    if (!isEditing) setInputValue(String(amount))
  }, [amount, isEditing])

  const handleBlur = useCallback(async () => {
    setIsEditing(false)
    const parsed = parseInt(inputValue, 10)
    const numAmount = isNaN(parsed) ? 0 : parsed

    if (numAmount === amount && giftId) {
      return
    }
    setIsGiftUpdating(true)
    const gift = {
      amount: numAmount,
      guestId: guest.id,
      type: GiftType.CASH,
      description: '',
      guestName: guest.name,
      guestSide: guest.side,
      guestCategory: guest.category,
    }
    if (giftId) {
      await updateGift(parseInt(giftId, 10), gift)
    } else if (numAmount > 0) {
      await addGift(gift)
    }
    setIsGiftUpdating(false)
  }, [guest, amount, giftId, inputValue, addGift, updateGift])

  const handleClick = () => setIsEditing(true)

  if (isGiftUpdating) {
    return <FontAwesomeIcon icon={faSpinner} spin />
  }
  if (isEditing) {
    return (
      <input
        type="number"
        min={0}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget.blur(), e.preventDefault())}
        className="w-16 rounded border border-gray-300 px-1 py-0.5 text-right text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoFocus
      />
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="min-w-8 rounded px-1 py-0.5 text-right hover:bg-gray-100 transition-colors">
      {amount}
    </button>
  )
}

export default GuestGiftCell
