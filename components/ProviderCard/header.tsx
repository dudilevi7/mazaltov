'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Provider } from '@/types/Provider'
import { SuggestedService, getSuggestedServiceByLabel } from '@/constants/providers'

interface ProviderCardHeaderProps {
  provider: Provider
  suggestedService?: SuggestedService
}

const ProviderCardHeader = ({ provider, suggestedService }: ProviderCardHeaderProps) => {
  const { name, service, toBePaid } = provider

  return (
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        {!toBePaid && <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded-md">שולם</span>}
        <span className="text-lg font-semibold text-gray-800">{name}</span>
      </div>
      <span className={`text-sm flex items-center gap-1 ${suggestedService?.color || 'text-gray-500'}`}>
        {suggestedService && <FontAwesomeIcon icon={suggestedService.icon} className="h-3 w-3" />}
        {service}
      </span>
    </div>
  )
}

export default ProviderCardHeader
