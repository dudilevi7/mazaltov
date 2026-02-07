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
import BudgetContent from './content'

const Budget = () => {
  const { totalPrice, totalPaid, totalToBePaid, biggestProvider, income, setIncome, estimatedTotal, balance } =
    useBudgetContext()
  const { languageDirection } = useAppContext()
  const [isIncomesModalOpen, setIsIncomesModalOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex shrink-0 flex-row items-center justify-between">
        <AppHeader />
      </div>
      <BudgetProgressBar />

      <BudgetContent setIsIncomesModalOpen={setIsIncomesModalOpen} />

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
