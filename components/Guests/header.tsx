'use client'

import AppHeader from '@/components/AppHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

const GuestsHeader = () => (
  <div className="flex shrink-0 flex-row items-center justify-between">
    <AppHeader />
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faUsers} className="text-lg text-gray-700" />
      <span className="text-base font-semibold text-gray-700">אורחים</span>
    </div>
  </div>
)

export default GuestsHeader
