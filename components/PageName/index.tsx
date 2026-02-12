'use client'

import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faHandshake, faCalendarDays, faUsers, faCoins, faGear } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'

interface PageConfig {
  path: string
  labelHe: string
  labelEn: string
  icon: IconDefinition
}

const PAGE_CONFIGS: PageConfig[] = [
  { path: '/tasks', labelHe: 'משימות', labelEn: 'Tasks', icon: faListCheck },
  {
    path: '/providers',
    labelHe: 'ספקים',
    labelEn: 'Providers',
    icon: faHandshake,
  },
  {
    path: '/calendar',
    labelHe: 'לוח שנה',
    labelEn: 'Calendar',
    icon: faCalendarDays,
  },
  { path: '/guests', labelHe: 'אורחים', labelEn: 'Guests', icon: faUsers },
  { path: '/budget', labelHe: 'תקציב', labelEn: 'Budget', icon: faCoins },
  {
    path: '/settings',
    labelHe: 'הגדרות',
    labelEn: 'Settings',
    icon: faGear,
  },
]

const PageName = () => {
  const pathname = usePathname() || ''
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB

  const config = PAGE_CONFIGS.find((cfg) => pathname.startsWith(cfg.path)) || null

  if (!config) {
    return null
  }

  const title = isRtl ? config.labelHe : config.labelEn

  return (
    <div className="flex items-center gap-2 text-gray-700 animate-fade-in-0.5">
      <FontAwesomeIcon icon={config.icon} className="text-lg text-gray-700" />
      <span className="text-base font-semibold">{title}</span>
    </div>
  )
}

export default PageName
