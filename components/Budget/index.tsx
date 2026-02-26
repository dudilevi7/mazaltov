'use client'

import { useState } from 'react'
import IncomesModal from '@/components/Budget/IncomesModal'
import { useBudgetContext } from '@/context/BudgetContext'
import BudgetProgressBar from './BudgetProgressBar'
import BudgetContent from './content'
import { useProvidersContext } from '@/context/ProvidersContext'
import SpinnerLoader from '../Shared/SpinnerLoader'

const Budget = () => {
  const { estimatedIncome, setEstimatedIncome } = useBudgetContext()
  const [isIncomesModalOpen, setIsIncomesModalOpen] = useState(false)
  const { isLoadingProviders } = useProvidersContext()
  if (isLoadingProviders) {
    return <SpinnerLoader size="lg" isLoadingPage />
  }
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
