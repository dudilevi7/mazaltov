'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faListCheck,
  faCalendarDays,
  faUsers,
  faCoins,
  faGear,
  faHandshake,
  faGift,
  faPlane,
  faRightFromBracket,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Tooltip, { TooltipPlace } from '../Tooltip'
import useSupabase from '@/hooks/useSupabase'
import UserDetails from './UserDetails'

interface SidebarItem {
  id: string
  labelHe: string
  labelEn: string
  icon: IconDefinition
  route?: string
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', labelHe: 'האירוע', labelEn: 'Dashboard', icon: faCalendar, route: '/dashboard' },
  { id: 'tasks', labelHe: 'משימות', labelEn: 'Tasks', icon: faListCheck, route: '/tasks' },
  { id: 'providers', labelHe: 'ספקים', labelEn: 'Providers', icon: faHandshake, route: '/providers' },
  { id: 'calendar', labelHe: 'לוח שנה', labelEn: 'Calendar', icon: faCalendarDays, route: '/calendar' },
  { id: 'guests', labelHe: 'אורחים', labelEn: 'Guests', icon: faUsers, route: '/guests' },
  { id: 'gifts', labelHe: 'מתנות', labelEn: 'Gifts', icon: faGift, route: '/gifts' },
  { id: 'budget', labelHe: 'תקציב', labelEn: 'Budget', icon: faCoins, route: '/budget' },
  { id: 'trips', labelHe: 'טיולים', labelEn: 'Trips', icon: faPlane, route: '/trips' },
  { id: 'settings', labelHe: 'הגדרות', labelEn: 'Settings', icon: faGear, route: '/settings' },
]

const AppSidebar = () => {
  const { languageDirection, isSidebarOpen, setSidebarOpen } = useAppContext()
  const { signOut } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()

  const isRtl = languageDirection === LanguageDirection.HEB
  const isRight = isRtl
  const ChevronIcon = isSidebarOpen
    ? isRight
      ? faChevronRight
      : faChevronLeft
    : isRight
      ? faChevronLeft
      : faChevronRight

  const handleItemClick = (item: SidebarItem) => {
    if (item.route) {
      router.push(item.route)
    }
  }

  return (
    <div
      className={`relative flex shrink-0 h-full min-h-screen bg-gray-100 border-gray-200 transition-all duration-300 ${
        isRight ? 'border-l' : 'border-r'
      } ${isSidebarOpen ? 'w-36' : 'w-12'}`}
      dir={isRtl ? 'rtl' : 'ltr'}>
      <div
        className={`flex flex-col h-full ${isSidebarOpen ? 'py-4 px-0 animate-fade-in-0.5' : 'py-4 px-0 items-center'}`}>
        <nav className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.route && pathname?.startsWith(item.route)

            return (
              <Tooltip
                content={!isSidebarOpen ? (isRtl ? item.labelHe : item.labelEn) : ''}
                place={!isSidebarOpen ? (isRtl ? TooltipPlace.LEFT : TooltipPlace.RIGHT) : TooltipPlace.TOP}
                key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-2 rounded-e-md text-gray-700 hover:bg-blue-500 hover:text-white transition-colors ${
                    isSidebarOpen
                      ? `w-full px-3 py-2 text-sm font-medium ${isRtl ? 'flex flex-row' : 'flex justify-start'}`
                      : 'w-10 h-10 justify-center rounded-s-none'
                  } ${isActive ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white' : 'text-gray-500'} cursor-pointer`}>
                  <FontAwesomeIcon icon={item.icon} className={`shrink-0`} />
                  {isSidebarOpen && (
                    <span className={`text-base animate-fade-in-0.5`}>{isRtl ? item.labelHe : item.labelEn}</span>
                  )}
                </button>
              </Tooltip>
            )
          })}
        </nav>
        <div className="absolute bottom-28 left-[50%] transform -translate-x-1/2 z-40 flex flex-col items-center gap-4">
          <UserDetails />
          <Tooltip
            content={!isSidebarOpen ? (isRtl ? 'יציאה' : 'Logout') : ''}
            place={!isSidebarOpen ? (isRtl ? TooltipPlace.LEFT : TooltipPlace.RIGHT) : TooltipPlace.TOP}>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-2 rounded-md text-gray-500 hover:text-red-600 w-full cursor-pointer">
              <FontAwesomeIcon icon={faRightFromBracket} className="shrink-0" />
              {isSidebarOpen && <span className="animate-fade-in-0.5">{isRtl ? 'יציאה' : 'Logout'}</span>}
            </button>
          </Tooltip>
        </div>
      </div>

      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={`absolute w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-r to-gray-50 from-gray-100 text-gray-600 transition-colors shadow-sm z-10 
          top-[70%] ${isRight ? `left-0 transform translate-[-50%]` : `right-0 transform translate-x-[50%] translate-y-[-50%]`} cursor-pointer`}>
        <FontAwesomeIcon icon={ChevronIcon} className="text-sm " />
      </button>
    </div>
  )
}

export default AppSidebar
