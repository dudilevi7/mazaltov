interface ShoppingItem {
  id: number
  name: string
  quantity: number
  isPurchased: boolean
  category: string
  notes: string
  estimatedPrice: number
  createdBy: string
  createdAt: number
  updatedAt: number
}

export type { ShoppingItem }
