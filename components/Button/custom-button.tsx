export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

const variantStyles = {
  default: 'bg-blue-500 text-white hover:bg-blue-600',
  white: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
  red: 'bg-red-500 text-white hover:bg-red-600',
}

const sizeStyles: Record<ButtonSize, string> = {
  [ButtonSize.SM]: 'px-3 py-1.5 text-sm rounded',
  [ButtonSize.MD]: 'px-4 py-2 rounded-md',
  [ButtonSize.LG]: 'px-6 py-3 text-lg rounded-lg',
}

interface CustomButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: keyof typeof variantStyles
  size?: ButtonSize
  icon?: React.ReactNode
}

const CustomButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'default',
  size = ButtonSize.MD,
  icon,
}: CustomButtonProps) => {
  return (
    <button
      type={type}
      className={`cursor-pointer inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}>
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
export default CustomButton
