import type { Provider } from '@/types/Provider'

export type ProviderRow = {
  id: number | string
  user_id: string
  name: string
  phone: string | null
  service: string
  price: number
  advance_payment: number
  to_be_paid: number
  comments: string
  payment_method: string
  created_at: string
  updated_at: string
}

const toNum = (v: number | string | null | undefined): number =>
  v === null || v === undefined ? 0 : typeof v === 'string' ? parseFloat(v) : v

export const mapProviderRowToProvider = (row: ProviderRow): Provider => ({
  id: typeof row.id === 'string' ? parseInt(row.id, 10) : row.id,
  name: row.name ?? '',
  phone: row.phone ?? undefined,
  service: row.service ?? '',
  price: toNum(row.price),
  advancePayment: toNum(row.advance_payment),
  toBePaid: toNum(row.to_be_paid),
  comments: row.comments ?? '',
  paymentMethod: (row.payment_method ?? 'cash') as Provider['paymentMethod'],
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapProviderToProviderRow = (
  provider: Partial<Provider> & { name?: string; service?: string }
) => ({
  name: provider.name ?? '',
  phone: provider.phone ?? null,
  service: provider.service ?? '',
  price: provider.price ?? 0,
  advance_payment: provider.advancePayment ?? 0,
  to_be_paid: provider.toBePaid ?? 0,
  comments: provider.comments ?? '',
  payment_method: provider.paymentMethod ?? 'cash',
})
