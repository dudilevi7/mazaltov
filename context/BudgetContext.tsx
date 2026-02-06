"use client";

import { createContext, useContext, useMemo } from "react";
import { useProvidersContext } from "@/context/ProvidersContext";
import type { Provider } from "@/types/Provider";

interface BudgetContextType {
  totalPrice: number;
  totalPaid: number;
  totalToBePaid: number;
  biggestProvider: Provider | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const { providers } = useProvidersContext();

  const value = useMemo(() => {
    const totalPrice = providers.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalPaid = providers.reduce((sum, p) => sum + (p.advancePayment || 0), 0);
    const totalToBePaid = providers.reduce((sum, p) => sum + (p.toBePaid || 0), 0);
    const biggestProvider =
      providers.length > 0
        ? providers.reduce((max, p) => (p.price > (max?.price ?? 0) ? p : max))
        : null;

    return {
      totalPrice,
      totalPaid,
      totalToBePaid,
      biggestProvider,
    };
  }, [providers]);

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
