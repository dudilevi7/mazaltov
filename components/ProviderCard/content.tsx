'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import type { Provider } from '@/types/Provider'
import type { Todo } from '@/types/Todo'
import { formatCurrency } from '@/lib/utils'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'

interface ProviderCardContentProps {
  provider: Provider
  providerTasks: Todo[]
  onAddProviderTask: (provider: Provider) => void
  onWatchProviderTasks: (provider: Provider) => void
  paymentMethodLabel: Record<string, string>
}

const ProviderCardContent = ({
  provider,
  providerTasks,
  onAddProviderTask,
  onWatchProviderTasks,
  paymentMethodLabel,
}: ProviderCardContentProps) => {
  const { price, advancePayment, toBePaid, comments, paymentMethod } = provider
  const hasTasks = providerTasks.length > 0

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div>
          <div className="text-gray-500 text-xs">מחיר כולל</div>
          <div className="font-medium">{formatCurrency(price)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">תשלום מקדמה</div>
          <div className="font-medium">{formatCurrency(advancePayment)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">נותר לתשלום</div>
          <div className="font-medium">{formatCurrency(toBePaid)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">אמצעי תשלום</div>
          <div className="font-medium">{paymentMethodLabel[paymentMethod] || paymentMethodLabel.other}</div>
        </div>
      </div>
      {comments && (
        <div className="flex flex-col mt-1 gap-2">
          <span className="text-gray-500 text-xs self-start">הערות</span>
          <p
            className="bg-gray-100 p-2 rounded-md border border-gray-200 text-sm text-gray-800 font-bold whitespace-pre-wrap min-h-20
          border-e-5">
            {comments}
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        <CustomButton
          size={ButtonSize.SM}
          variant="white"
          className="bg-gray-100 hover:bg-blue-200 hover:text-blue-600"
          onClick={() => onAddProviderTask(provider)}
          icon={<FontAwesomeIcon icon={faPlus} />}>
          הוסף משימת ספק
        </CustomButton>
        {hasTasks && (
          <CustomButton
            size={ButtonSize.SM}
            className="bg-blue-300 hover:bg-blue-400 text-gray-900"
            onClick={() => onWatchProviderTasks(provider)}
            icon={<FontAwesomeIcon icon={faEye} />}>
            צפה במשימות ספק
          </CustomButton>
        )}
      </div>
    </div>
  )
}

export default ProviderCardContent
