import type { Guest } from '@/types/Guest'

export type GuestRow = {
  id: number | string
  user_id: string
  name: string
  quantity: number
  status: string
  side: string
  table_number: number | null
  phone_number: string | null
  category: string
  gift: number
  notes: string | null
  created_at: string
  updated_at: string
}

const toNum = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === 'string' ? parseFloat(v) : v

export const mapGuestRowToGuest = (row: GuestRow): Guest => ({
  id: typeof row.id === 'string' ? parseInt(row.id, 10) : row.id,
  name: row.name ?? '',
  quantity: row.quantity ?? 1,
  status: (row.status ?? 'pending') as Guest['status'],
  side: row.side ?? '',
  table: row.table_number ?? undefined,
  phoneNumber: row.phone_number ?? undefined,
  category: row.category ?? '',
  gift: toNum(row.gift),
  manualApproval: (row.status ?? 'pending') === 'accepted',
  notes: row.notes ?? undefined,
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapGuestToGuestRow = (
  guest: Partial<Guest> & { name?: string; status?: string }
) => ({
  name: guest.name ?? '',
  quantity: guest.quantity ?? 1,
  status: guest.status ?? 'pending',
  side: guest.side ?? '',
  table_number: guest.table ?? null,
  phone_number: guest.phoneNumber ?? null,
  category: guest.category ?? '',
  gift: guest.gift ?? 0,
  notes: guest.notes ?? null,
})
