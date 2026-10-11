'use client'

import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { EVENT_SETUP_LABELS } from '@/constants/eventSetup'

// Single source of truth for "can the user create things yet?".
// Create buttons use `canCreate` + `gateTooltip`; the guide uses `showGuide`.
const useEventGate = () => {
  const router = useRouter()
  const { activeEventId, isEventAccessResolved, isLoadingEventSettings, languageDirection } = useAppContext()
  const labels = languageDirection === LanguageDirection.HEB ? EVENT_SETUP_LABELS.HEB : EVENT_SETUP_LABELS.ENG

  const hasEvent = !!activeEventId
  // While resolving, actions stay disabled but the guide is withheld to avoid a false "no event" flash.
  const isResolving = !isEventAccessResolved || isLoadingEventSettings
  const canCreate = hasEvent && !isResolving
  const showGuide = !isResolving && !hasEvent

  return {
    hasEvent,
    isResolving,
    canCreate,
    showGuide,
    labels,
    gateTooltip: canCreate ? undefined : labels.disabledTooltip,
    goToSettings: () => router.push('/settings'),
  }
}

export default useEventGate
