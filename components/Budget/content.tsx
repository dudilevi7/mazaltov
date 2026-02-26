import { useAppContext } from '@/context/AppContext'
import { useBudgetContext } from '@/context/BudgetContext'
import { formatCurrency } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons'
import CustomButton, { ButtonSize } from '../Button/custom-button'
import ExpensesSection from './ExpensesSection'
import Tooltip from '../Tooltip'
interface BudgetContentProps {
  setIsIncomesModalOpen: (isOpen: boolean) => void
}

const BudgetContent: React.FC<BudgetContentProps> = ({ setIsIncomesModalOpen }) => {
  const { languageDirection } = useAppContext()
  const {
    estimatedIncome,
    totalPrice,
    balance,
    biggestProvider,
    estimatedTotal,
    guestsIncome,
    guestsWithGiftCount,
    avgGiftPerGuestActual,
  } = useBudgetContext()

  return (
    <div className="flex flex-col gap-6 animate-fade-in-0.5">
      {(estimatedIncome || totalPrice > 0 || guestsIncome > 0) && (
        <div
          className={`rounded-lg p-4 shadow-sm border flex items-center gap-2 ${
            balance >= 0 ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
          }`}
          dir={languageDirection}>
          <FontAwesomeIcon icon={faMoneyBillAlt} className={balance >= 0 ? 'text-green-600' : 'text-red-600'} />
          <span className={balance >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            מאזן: {formatCurrency(balance)}
          </span>
          <Tooltip content="מאזן הוא ההפרש בין התוצאות להכנסות המשוערות">
            <FontAwesomeIcon icon={faInfoCircle} className={balance >= 0 ? 'text-green-600' : 'text-red-600'} />
          </Tooltip>
        </div>
      )}
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200" dir={languageDirection}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">הכנסות</h2>
          <CustomButton size={ButtonSize.SM} onClick={() => setIsIncomesModalOpen(true)}>
            {estimatedTotal ? 'שנה הכנסות משוערות' : 'הוסף הכנסות משוערות'}
          </CustomButton>
        </div>

        {guestsIncome > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMoneyBillAlt} className="text-green-600" />
              <span className="font-semibold text-gray-900">
                הכנסות אורחים סה&quot;כ: {formatCurrency(guestsIncome)}
              </span>
            </div>
            <span className="text-sm text-gray-600">אורחים: {guestsWithGiftCount}</span>
            <span className="text-sm text-gray-600">מתנה ממוצעת לאורח: {formatCurrency(avgGiftPerGuestActual)}</span>
          </div>
        )}

        {guestsIncome > 0 && estimatedIncome && <hr className="border-gray-200 my-2" />}

        {estimatedIncome && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMoneyBillAlt} className="text-gray-500" />
              <span className="font-semibold text-gray-900">
                הכנסות משוערות סה&quot;כ: {formatCurrency(estimatedTotal)}
              </span>
            </div>
            <span className="text-sm text-gray-600">אורחים: {estimatedIncome.numberOfGuests}</span>
            <span className="text-sm text-gray-600">
              מתנה ממוצעת לאורח: {formatCurrency(estimatedIncome.avgGiftPerGuest)}
            </span>
          </div>
        )}
      </div>

      <ExpensesSection />

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

      {!biggestProvider && totalPrice === 0 && !estimatedIncome && (
        <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
          אין נתוני תקציב. הוסף ספקים בדף הספקים והכנסות משוערות.
        </div>
      )}
    </div>
  )
}

export default BudgetContent
