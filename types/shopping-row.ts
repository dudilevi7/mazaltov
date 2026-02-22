import type { ShoppingItem } from '@/types/ShoppingItem'

export type ShoppingItemRow = {
  id: number | string
  user_id: string
  name: string
  quantity: number
  is_purchased: boolean
  category: string
  notes: string
  estimated_price: number
  created_by: string
  created_at: string
  updated_at: string
}

const toNum = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === 'string' ? parseInt(v, 10) : v

export const mapShoppingRowToItem = (row: ShoppingItemRow): ShoppingItem => ({
  id: toNum(row.id),
  name: row.name ?? '',
  quantity: row.quantity ?? 1,
  isPurchased: row.is_purchased ?? false,
  category: row.category ?? '',
  notes: row.notes ?? '',
  estimatedPrice: Number(row.estimated_price) || 0,
  createdBy: row.created_by ?? '',
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapItemToShoppingRow = (item: Partial<ShoppingItem>) => ({
  name: item.name ?? '',
  quantity: item.quantity ?? 1,
  is_purchased: item.isPurchased ?? false,
  category: item.category ?? '',
  notes: item.notes ?? '',
  estimated_price: item.estimatedPrice ?? 0,
  created_by: item.createdBy ?? '',
})
