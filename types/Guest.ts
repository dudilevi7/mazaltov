enum GuestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

enum GuestSide {
  BRIDE = 'bride',
  GROOM = 'groom',
  BOTH = 'both',
}

interface Guest {
  id: number
  name: string
  quantity: number
  status: GuestStatus
  side: GuestSide
  table?: number
  phoneNumber?: string
  category: string
  gift: number
  manualApproval: boolean
  createdAt: number
  updatedAt: number
}

export { GuestStatus, GuestSide }
export type { Guest }

