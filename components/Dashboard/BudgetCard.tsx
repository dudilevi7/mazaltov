import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import Card, { CardVariant } from '@/components/Shared/Card'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import { formatCurrency } from '@/lib/utils'

interface BudgetCardProps {
  isHebrew: boolean
  isLoading: boolean
  income: number
  expenses: number
  paid: number
  remaining: number
  balance: number
  onClick: () => void
}

interface BudgetStatProps {
  label: string
  value: string
  valueClassName: string
}

const BudgetStat = ({ label, value, valueClassName }: BudgetStatProps) => (
  <div className="min-w-0">
    <p className="text-xs text-slate-400">{label}</p>
    <p className={`mt-1 text-sm font-semibold tabular-nums sm:text-base ${valueClassName}`}>{value}</p>
  </div>
)

const BudgetCard = ({ isHebrew, isLoading, income, expenses, paid, remaining, balance, onClick }: BudgetCardProps) => {
  const paidPercent = expenses > 0 ? Math.min(100, Math.round((paid / expenses) * 100)) : 0
  const trackLabel = isHebrew
    ? `שולם ${paidPercent}%, נותר ${formatCurrency(remaining)}`
    : `Paid ${paidPercent}%, remaining ${formatCurrency(remaining)}`

  return (
    <Card
      variant={CardVariant.NAVY}
      onClick={onClick}
      style={{ animationDelay: '280ms' }}
      className="flex flex-col gap-6 text-start motion-safe:animate-rise md:col-span-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FontAwesomeIcon icon={faCoins} className="text-sky-300" />
            {isHebrew ? 'תקציב' : 'Budget'}
          </p>
          {isLoading ? (
            <div className="mt-4 flex min-h-16 items-center">
              <SpinnerLoader size="lg" />
            </div>
          ) : (
            <>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-white tabular-nums md:text-5xl">
                {formatCurrency(balance)}
              </p>
              <p className="mt-1 text-sm text-slate-400">{isHebrew ? 'יתרה' : 'Balance'}</p>
            </>
          )}
        </div>
        {!isLoading && (
          <div className="grid w-full grid-cols-3 gap-4 sm:w-auto sm:gap-8">
            <BudgetStat label={isHebrew ? 'הכנסות' : 'Income'} value={formatCurrency(income)} valueClassName="text-emerald-400" />
            <BudgetStat label={isHebrew ? 'הוצאות' : 'Expenses'} value={formatCurrency(expenses)} valueClassName="text-rose-400" />
            <BudgetStat label={isHebrew ? 'שולם' : 'Paid'} value={formatCurrency(paid)} valueClassName="text-sky-400" />
          </div>
        )}
      </div>
      {!isLoading && (
        <div className="flex items-center gap-3">
          <div
            className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={paidPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={trackLabel}>
            <div
              className="h-full rounded-full bg-sky-400 motion-safe:transition-[width] motion-safe:duration-700"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
          <span className="text-xs font-medium tabular-nums text-slate-300">{paidPercent}%</span>
        </div>
      )}
    </Card>
  )
}

export default BudgetCard
