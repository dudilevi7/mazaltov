'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProvidersContext } from '@/context/ProvidersContext'
import { useGuestsContext } from '@/context/GuestsContext'
import type { Provider } from '@/types/Provider'
import type { EstimatedIncome } from '@/types/Income'
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils'
import { MAZAL_TOV_INCOMES_KEY } from '@/constants/localStorage'

interface BudgetContextType {
  totalPrice: number
  totalPaid: number
  totalToBePaid: number
  biggestProvider: Provider | null
  providers: Provider[]
  estimatedIncome: EstimatedIncome | null
  setEstimatedIncome: (estimatedIncome: EstimatedIncome) => void
  estimatedTotal: number
  balance: number
  guestsIncome: number
  guestsWithGiftCount: number
  avgGiftPerGuestActual: number
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const { providers } = useProvidersContext()
  const { guests } = useGuestsContext()
  const [estimatedIncome, setEstimatedIncomeState] = useState<EstimatedIncome | null>(null)

  useEffect(() => {
    setEstimatedIncomeState(getFromLocalStorage(MAZAL_TOV_INCOMES_KEY, null))
  }, [])

  const setEstimatedIncome = (data: EstimatedIncome) => {
    setEstimatedIncomeState(data)
    setToLocalStorage(MAZAL_TOV_INCOMES_KEY, data)
  }

  const value = useMemo(() => {
    const totalPrice = providers.reduce((sum, p) => sum + (p.price || 0), 0)
    const totalPaid = providers.reduce((sum, p) => sum + (p.advancePayment || 0), 0)
    const totalToBePaid = providers.reduce((sum, p) => sum + (p.toBePaid || 0), 0)
    const biggestProvider =
      providers.length > 0 ? providers.reduce((max, p) => (p.price > (max?.price ?? 0) ? p : max)) : null

    const estimatedTotal = estimatedIncome ? estimatedIncome.numberOfGuests * estimatedIncome.avgGiftPerGuest : 0

    const guestsIncome = guests.reduce((sum, g) => sum + (g.gift || 0), 0)
    const guestsWithGiftCount = guests.filter((g) => g.gift > 0).length
    const avgGiftPerGuestActual = guestsWithGiftCount > 0 ? guestsIncome / guestsWithGiftCount : 0

    const balance = (guestsIncome > 0 ? guestsIncome : estimatedTotal) - totalPrice

    return {
      totalPrice,
      totalPaid,
      totalToBePaid,
      biggestProvider,
      providers,
      estimatedIncome,
      setEstimatedIncome,
      estimatedTotal,
      balance,
      guestsIncome,
      guestsWithGiftCount,
      avgGiftPerGuestActual,
    }
  }, [providers, estimatedIncome, guests])

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

const useBudgetContext = (): BudgetContextType => {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useBudgetContext must be used within BudgetProvider')
  }
  return context
}

export { BudgetProvider, useBudgetContext }
