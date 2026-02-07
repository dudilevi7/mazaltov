'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons'
import AppHeader from '@/components/AppHeader'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import ProgressBar from '@/components/Shared/ProgressBar'
import IncomesModal from '@/components/Budget/IncomesModal'
import { useAppContext } from '@/context/AppContext'
import { useBudgetContext } from '@/context/BudgetContext'
import { formatCurrency } from '@/lib/utils'
import BudgetProgressBar from './BudgetProgressBar'

const Budget = () => {
  const { totalPrice, totalPaid, totalToBePaid, biggestProvider, income, setIncome, estimatedTotal, balance } =
    useBudgetContext()
  const { languageDirection } = useAppContext()
  const [isIncomesModalOpen, setIsIncomesModalOpen] = useState(false)

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex flex-row items-center justify-between">
        <AppHeader />
      </div>
      <BudgetProgressBar />
      <div className="flex flex-col gap-6 animate-fade-in-0.5 overflow-auto">
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200" dir={languageDirection}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">הכנסות</h2>
            <CustomButton size={ButtonSize.SM} onClick={() => setIsIncomesModalOpen(true)}>
              הוסף הכנסות משוערות
            </CustomButton>
          </div>
          {income && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBillAlt} className="text-gray-500" />
                <span className="font-semibold text-gray-900">
                  הכנסות משוערות סה&quot;כ: {formatCurrency(estimatedTotal)}
                </span>
              </div>
              <span className="text-sm text-gray-600">אורחים: {income.numberOfGuests}</span>
              <span className="text-sm text-gray-600">מתנה ממוצעת לאורח: {formatCurrency(income.avgGiftPerGuest)}</span>
            </div>
          )}
        </div>

        {(income || totalPrice > 0) && (
          <div
            className={`rounded-lg p-4 shadow-sm border flex items-center gap-2 ${
              balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
            dir={languageDirection}>
            <FontAwesomeIcon icon={faMoneyBillAlt} className={balance >= 0 ? 'text-green-600' : 'text-red-600'} />
            <span className={balance >= 0 ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
              מאזן: {formatCurrency(balance)}
            </span>
          </div>
        )}

        {biggestProvider && (
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200" dir={languageDirection}>
            <h3 className="mb-2 text-sm font-medium text-gray-500">הספק בעל המחיר הגבוה ביותר</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">{biggestProvider.name}</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(biggestProvider.price)}</span>
            </div>
            <span className="text-sm text-gray-500">{biggestProvider.service}</span>
          </div>
        )}

        {!biggestProvider && totalPrice === 0 && !income && (
          <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
            אין נתוני תקציב. הוסף ספקים בדף הספקים והכנסות משוערות.
          </div>
        )}
      </div>

      <IncomesModal
        isOpen={isIncomesModalOpen}
        onClose={() => setIsIncomesModalOpen(false)}
        onSave={(data) => {
          setIncome(data)
          setIsIncomesModalOpen(false)
        }}
        income={income}
      />
    </div>
  )
}

export default Budget
