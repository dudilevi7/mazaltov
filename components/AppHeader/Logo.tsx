import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRing } from '@fortawesome/free-solid-svg-icons'

interface LogoProps {
  className?: string
}
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`flex flex-row gap-1 items-center animate-fade-in-0.5 ${className}`}>
      <FontAwesomeIcon icon={faRing} className="text-gray-300 animate-pulse max-w-8" size="2x" />
      <span className="text-2xl font-bold text-gray-800 rounded-md">MazalTov</span>
    </div>
  )
}
export default Logo
