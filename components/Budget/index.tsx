"use client";

import AppHeader from "@/components/AppHeader";
import ProgressBar from "@/components/Shared/ProgressBar";
import { useAppContext } from "@/context/AppContext";
import { useBudgetContext } from "@/context/BudgetContext";
import { formatCurrency } from "@/lib/utils";

const Budget = () => {
  const { totalPrice, totalPaid, totalToBePaid, biggestProvider } = useBudgetContext();
  const { languageDirection } = useAppContext();

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex flex-row items-center justify-between">
        <AppHeader />
      </div>

      <div className="flex flex-col gap-6 animate-fade-in-0.5">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800" dir={languageDirection}>התקדמות הוצאות</h2>
          <ProgressBar
            total={totalPrice}
            completed={totalPaid}
            remaining={totalToBePaid}
          />
          <div className="mt-2 flex gap-4 text-sm text-gray-600" dir={languageDirection}>
            <span className="text-green-600">שולם: {formatCurrency(totalPaid)}</span>
            <span className="text-red-500">נותר: {formatCurrency(totalToBePaid)}</span>
            <span className="text-gray-900">סה"כ: {formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {biggestProvider && (
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200" dir={languageDirection}>
            <h3 className="mb-2 text-sm font-medium text-gray-500">הספק בעל המחיר הגבוה ביותר</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">{biggestProvider.name}</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(biggestProvider.price)}
              </span>
            </div>
            <span className="text-sm text-gray-500">{biggestProvider.service}</span>
          </div>
        )}

        {!biggestProvider && totalPrice === 0 && (
          <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
            אין נתוני תקציב. הוסף ספקים בדף הספקים.
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
