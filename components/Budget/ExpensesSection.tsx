'use client'

import { useAppContext } from '@/context/AppContext'
import { useBudgetContext } from '@/context/BudgetContext'
import { formatCurrency } from '@/lib/utils'
import ProviderPaymentChip from './ProviderPaymentChip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '../Button/custom-button'
import { exportExpensesToExcel } from './helper'

const ExpensesSection = () => {
  const { languageDirection } = useAppContext()
  const { totalPrice, totalPaid, totalToBePaid, providers } = useBudgetContext()

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200" dir={languageDirection}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">הוצאות</h2>
        {providers.length > 0 && (
          <CustomButton
            size={ButtonSize.SM}
            variant="white"
            onClick={() => exportExpensesToExcel(providers, languageDirection)}
            icon={<FontAwesomeIcon icon={faFileExcel} className="text-green-600" />}>
            ייצוא לאקסל
          </CustomButton>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 text-sm">
          <span className="text-gray-600">סה&quot;כ הוצאות</span>
          <span className="font-medium text-gray-900">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-row gap-2">
            <span className="text-gray-600">שולם</span>
            <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex flex-row gap-2">
            <span className="text-gray-600">נותר לתשלום</span>
            <span className="font-bold text-red-600">{formatCurrency(totalToBePaid)}</span>
          </div>
        </div>
      </div>

      {providers.length > 0 && (
        <div>
          <div className="flex flex-row gap-1 items-center mb-2">
            <FontAwesomeIcon icon={faCircleInfo} className="text-gray-500 w-3 h-3" />
            <span className="text-sm font-medium text-gray-500">ספקים ותשלום</span>
            <span className="text-sm font-medium text-gray-500">({providers.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {providers.map((provider) => (
              <ProviderPaymentChip key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpensesSection
