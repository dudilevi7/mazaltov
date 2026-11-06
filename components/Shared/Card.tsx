export enum CardVariant {
  DEFAULT = 'default',
  GRADIENT = 'gradient',
  BLUE = 'blue',
  SUBTLE = 'subtle',
  EVENT = 'event',
  GUESTS = 'guests',
  TASKS = 'tasks',
  NOTES = 'notes',
  NAVY = 'navy',
  TRIPS = 'trips',
}

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'className'> {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: CardVariant
}

const lift =
  'cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.05)] motion-safe:transition motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(15,23,42,0.34)]'

const navyLift =
  'cursor-pointer shadow-[0_14px_30px_-18px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] motion-safe:transition motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 hover:shadow-[0_20px_36px_-18px_rgba(15,23,42,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]'

const variantStyles: Record<CardVariant, string> = {
  default: 'rounded-lg border bg-gray-50 border-gray-200 p-6',
  gradient:
    'group cursor-pointer rounded-lg border bg-linear-to-r from-white to-gray-50 border-gray-200 p-6 hover:border-blue-400 hover:from-blue-600 hover:to-blue-700',
  blue: 'cursor-pointer rounded-lg border bg-linear-to-r from-blue-600 to-blue-700 border-blue-400 p-6 transition-shadow',
  subtle:
    'group cursor-pointer rounded-lg border bg-linear-to-r from-white to-gray-50 border-gray-200 p-6 hover:border-gray-300 transition-shadow',
  event:
    'relative overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-sky-100 via-blue-50 to-white p-6 text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.05)] motion-safe:transition motion-safe:duration-500 hover:from-blue-100 hover:via-sky-50 hover:to-white sm:p-8 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.72)_50%,transparent_72%)] before:bg-[length:220%_220%] before:bg-no-repeat motion-safe:before:animate-drift [&>*]:relative [&>*]:z-10',
  guests: `overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 hover:bg-sky-50 ${lift}`,
  tasks: `overflow-hidden rounded-3xl border border-white/15 bg-linear-to-br from-blue-600 to-blue-700 p-6 text-white hover:from-blue-500 hover:to-blue-600 ${lift}`,
  notes: `relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-slate-50 to-indigo-100/70 p-6 text-slate-900 hover:from-indigo-100 hover:via-white hover:to-indigo-50 ${lift}`,
  navy: `overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 to-blue-950 p-6 text-white hover:from-slate-800 hover:to-blue-900 sm:p-8 ${navyLift}`,
  trips: `overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 hover:bg-slate-50 ${lift}`,
}

const Card = ({ children, onClick, className = '', variant = CardVariant.DEFAULT, ...rest }: CardProps) => {
  return (
    <div
      {...rest}
      onClick={onClick}
      className={`transition-all motion-reduce:transition-none ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}

export default Card
