enum GuestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

interface Guest {
  id: number
  name: string
  quantity: number
  status: GuestStatus
  side: string
  table?: number
  phoneNumber?: string
  category: string
  gift: number
  manualApproval?: boolean
  notes?: string
  createdAt: number
  updatedAt: number
}

enum GuestSide {
  BRIDE = 'bride',
  GROOM = 'groom',
  BOTH = 'both',
  OWNER = 'owner',
}

export { GuestStatus, GuestSide }
export type { Guest }
