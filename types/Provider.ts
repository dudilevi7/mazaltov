enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  CHECK = 'check',
  OTHER = 'other',
}

interface Provider {
  id: number
  name: string
  phone?: string
  service: string
  price: number
  advancePayment: number
  toBePaid: number
  comments: string
  paymentMethod: PaymentMethod
  createdAt: number
  updatedAt: number
}

enum PaidFilterStatus {
  ALL = 'all',
  PAID = 'paid',
  NOT_PAID = 'not_paid',
}
export { PaymentMethod, PaidFilterStatus }
export type { Provider }
