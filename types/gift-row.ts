import type { Gift } from '@/types/Gift'

export type GiftRow = {
  id: number | string
  user_id: string
  guest_id: number | null
  amount: number
  type: string
  description: string
  guest_name: string
  guest_side: string
  guest_category: string
  created_at: string
  updated_at: string
}

const toNum = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === 'string' ? parseFloat(v) : v

export const mapGiftRowToGift = (row: GiftRow): Gift => ({
  id: typeof row.id === 'string' ? parseInt(row.id, 10) : row.id,
  guestId: row.guest_id ?? null,
  amount: toNum(row.amount),
  type: (row.type ?? 'cash') as Gift['type'],
  description: row.description ?? '',
  guestName: row.guest_name ?? '',
  guestSide: row.guest_side ?? '',
  guestCategory: row.guest_category ?? '',
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapGiftToGiftRow = (
  gift: Partial<Gift> & { guestName?: string }
) => ({
  guest_id: gift.guestId ?? null,
  amount: gift.amount ?? 0,
  type: gift.type ?? 'cash',
  description: gift.description ?? '',
  guest_name: gift.guestName ?? '',
  guest_side: gift.guestSide ?? '',
  guest_category: gift.guestCategory ?? '',
})
