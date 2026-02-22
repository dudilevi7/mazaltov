'use client'

import { useState } from 'react'
import IncomesModal from '@/components/Budget/IncomesModal'
import { useBudgetContext } from '@/context/BudgetContext'
import BudgetProgressBar from './BudgetProgressBar'
import BudgetContent from './content'

const Budget = () => {
  const { estimatedIncome, setEstimatedIncome } = useBudgetContext()
  const [isIncomesModalOpen, setIsIncomesModalOpen] = useState(false)

  return (
    <div className="flex w-full flex-col font-sans">
      <BudgetProgressBar />

      <BudgetContent setIsIncomesModalOpen={setIsIncomesModalOpen} />

      <IncomesModal
        isOpen={isIncomesModalOpen}
        onClose={() => setIsIncomesModalOpen(false)}
        onSave={(data) => {
          setEstimatedIncome(data)
          setIsIncomesModalOpen(false)
        }}
        estimatedIncome={estimatedIncome}
      />
    </div>
  )
}

export default Budget
