import { formatCurrency } from '@/lib/utils'
import ProgressBar from '../Shared/ProgressBar'
import { useAppContext } from '@/context/AppContext'
import { useBudgetContext } from '@/context/BudgetContext'

const BudgetProgressBar = () => {
  const { languageDirection } = useAppContext()
  const { totalPrice, totalPaid, totalToBePaid } = useBudgetContext()

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800" dir={languageDirection}></h2>
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800" dir={languageDirection}>
          התקדמות הוצאות
        </h2>
        <ProgressBar total={totalPrice} completed={totalPaid} remaining={totalToBePaid} />
        <div className="mt-2 flex gap-4 text-sm text-gray-600" dir={languageDirection}>
          <span className="text-green-600">שולם: {formatCurrency(totalPaid)}</span>
          <span className="text-red-500">נותר: {formatCurrency(totalToBePaid)}</span>
          <span className="text-gray-900">סה&quot;כ: {formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  )
}

export default BudgetProgressBar
