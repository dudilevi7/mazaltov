export enum CardVariant {
  DEFAULT = 'default',
  GRADIENT = 'gradient',
  BLUE = 'blue',
  SUBTLE = 'subtle',
}

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: CardVariant
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-gray-50 border-gray-200',
  gradient:
    'bg-linear-to-r from-white to-gray-50 border-gray-200 hover:border-blue-400 hover:from-blue-600 hover:to-blue-700 group cursor-pointer',
  blue: 'bg-linear-to-r from-blue-600 to-blue-700 border-blue-400 cursor-pointer transition-shadow',
  subtle:
    'bg-linear-to-r from-white to-gray-50 border-gray-200 hover:border-gray-300 group cursor-pointer transition-shadow',
}

const Card = ({ children, onClick, className = '', variant = CardVariant.DEFAULT }: CardProps) => {
  return (
    <div onClick={onClick} className={`rounded-lg p-6 transition-all border ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}

export default Card
