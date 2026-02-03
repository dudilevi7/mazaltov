interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}
const CustomButton = ({ children, onClick, className, type = 'button' }: CustomButtonProps) => {
    return (
        <button type={type} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer ${className}`} onClick={onClick}>{children}</button>
    )
}
export default CustomButton;