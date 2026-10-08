'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import useEventGate from '@/hooks/useEventGate'
import { LanguageDirection } from '@/types/General'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Card, { CardVariant } from '@/components/Shared/Card'

interface EventSetupGuideProps {
  variant?: 'banner' | 'card'
  className?: string
}

// Onboarding callout shown while the user has no event yet. Visibility is the caller's job.
const EventSetupGuide = ({ variant = 'banner', className = '' }: EventSetupGuideProps) => {
  const { languageDirection } = useAppContext()
  const { labels, goToSettings } = useEventGate()
  const isHeb = languageDirection === LanguageDirection.HEB
  const arrow = isHeb ? faArrowLeft : faArrowRight

  if (variant === 'card') {
    return (
      <Card
        variant={CardVariant.GRADIENT}
        onClick={goToSettings}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            goToSettings()
          }
        }}
        className={`flex flex-col items-center justify-center text-center gap-3 min-h-[180px] h-full animate-fade-in-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-white/20 group-hover:text-white">
          <FontAwesomeIcon icon={faGear} className="text-xl" />
        </div>
        <span className="text-base font-semibold text-gray-800 transition-colors group-hover:text-white">
          {labels.title}
        </span>
        <span className="text-sm text-gray-500 transition-colors group-hover:text-white">{labels.body}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors group-hover:text-white">
          {labels.cta}
          <FontAwesomeIcon icon={arrow} className="text-xs" />
        </span>
      </Card>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      dir={languageDirection}
      className={`mb-4 flex flex-col gap-3 rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-4 shadow-sm animate-fade-in-0.5 motion-reduce:animate-none sm:flex-row sm:items-center ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <FontAwesomeIcon icon={faGear} className="text-lg" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-gray-800">{labels.title}</p>
        <p className="mt-0.5 text-sm text-gray-600">{labels.body}</p>
      </div>
      <CustomButton
        size={ButtonSize.MD}
        onClick={goToSettings}
        icon={<FontAwesomeIcon icon={arrow} />}
        className="w-full justify-center text-sm font-medium shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ms-auto sm:w-auto">
        {labels.cta}
      </CustomButton>
    </div>
  )
}

export default EventSetupGuide
