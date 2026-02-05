const variantStyles = {
  default: "bg-blue-500 text-white hover:bg-blue-600",
  white: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
  red: "bg-red-500 text-white hover:bg-red-600",
};
interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: keyof typeof variantStyles;
}

const CustomButton = ({
  children,
  onClick,
  className = "",
  type = "button",
  variant = "default",
}: CustomButtonProps) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md cursor-pointer ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default CustomButton;