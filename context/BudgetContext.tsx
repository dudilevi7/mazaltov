"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProvidersContext } from "@/context/ProvidersContext";
import type { Provider } from "@/types/Provider";
import type { Income } from "@/types/Income";
import { getFromLocalStorage, setToLocalStorage } from "@/lib/utils";
import { MAZAL_TOV_INCOMES_KEY } from "@/constants/localStorage";

interface BudgetContextType {
  totalPrice: number;
  totalPaid: number;
  totalToBePaid: number;
  biggestProvider: Provider | null;
  providers: Provider[];
  income: Income | null;
  setIncome: (income: Income) => void;
  estimatedTotal: number;
  balance: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const { providers } = useProvidersContext();
  const [income, setIncomeState] = useState<Income | null>(null);

  useEffect(() => {
    setIncomeState(getFromLocalStorage(MAZAL_TOV_INCOMES_KEY, null));
  }, []);

  const setIncome = (data: Income) => {
    setIncomeState(data);
    setToLocalStorage(MAZAL_TOV_INCOMES_KEY, data);
  };

  const value = useMemo(() => {
    const totalPrice = providers.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalPaid = providers.reduce((sum, p) => sum + (p.advancePayment || 0), 0);
    const totalToBePaid = providers.reduce((sum, p) => sum + (p.toBePaid || 0), 0);
    const biggestProvider =
      providers.length > 0
        ? providers.reduce((max, p) => (p.price > (max?.price ?? 0) ? p : max))
        : null;

    const estimatedTotal = income
      ? income.numberOfGuests * income.avgGiftPerGuest
      : 0;
    const balance = estimatedTotal - totalPrice;

    return {
      totalPrice,
      totalPaid,
      totalToBePaid,
      biggestProvider,
      providers,
      income,
      setIncome,
      estimatedTotal,
      balance,
    };
  }, [providers, income]);

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

const useBudgetContext = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgetContext must be used within BudgetProvider");
  }
  return context;
};

export { BudgetProvider, useBudgetContext };
