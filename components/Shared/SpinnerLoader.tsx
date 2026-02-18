import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRing, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerLoaderProps {
  className?: string
  size?: SpinnerSize
  isLoadingPage?: boolean
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const SpinnerLoader = ({ className = '', size = 'md', isLoadingPage = false }: SpinnerLoaderProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  if (isLoadingPage) {
    return (
      <div className={`flex gap-1.5 justify-center items-center h-[80vh] m-auto ${className}`} dir={languageDirection}>
        <FontAwesomeIcon icon={faRing} spin size="xl" className="text-gray-400" />
        <span className="text-lg text-gray-500 animate-pulse">{isRtl ? 'טוען...' : 'Loading...'}</span>
      </div>
    )
  }
  return (
    <span
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  )
}

export default SpinnerLoader
