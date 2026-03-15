enum GiftType {
  CASH = 'cash',
  CHECK = 'check',
  BIT = 'bit',
  PAYBOX = 'paybox',
  CREDIT_CARD = 'credit_card',
  TRANSFER = 'transfer',
  PHYSICAL = 'physical',
  OTHER = 'other',
}

interface Gift {
  id: number
  guestId: number | null
  amount: number
  type: GiftType
  description: string
  guestName: string
  guestSide: string
  guestCategory: string
  createdAt: number
  updatedAt: number
}

export { GiftType }
export type { Gift }
