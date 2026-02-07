'use client'

import type { Provider } from '@/types/Provider'
import { formatCurrency } from '@/lib/utils'
import Tooltip from '../Tooltip'

interface ProviderPaymentChipProps {
  provider: Provider
}

const ProviderPaymentChip = ({ provider }: ProviderPaymentChipProps) => {
  const toBePaid = provider.toBePaid ?? 0
  const isFullyPaid = toBePaid <= 0

  return (
    <Tooltip place="top" content={toBePaid > 0 ? `נותר לתשלום: ${formatCurrency(toBePaid)}` : ''}>
      <div
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          isFullyPaid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
        }`}>
        <span className="font-semibold">{provider.name}</span>
        <span className="mx-1">–</span>
        <span>{formatCurrency(provider.price)}</span>
      </div>
    </Tooltip>
  )
}

export default ProviderPaymentChip
