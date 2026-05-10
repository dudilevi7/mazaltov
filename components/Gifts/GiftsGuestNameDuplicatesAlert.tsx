'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import type { GuestNameDuplicateGroup } from './helper'

type GiftsGuestNameDuplicatesAlertProps = {
  groups: GuestNameDuplicateGroup[]
}

const GiftsGuestNameDuplicatesAlert = ({ groups }: GiftsGuestNameDuplicatesAlertProps) => {
  if (groups.length === 0) return null

  return (
    <div
      className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-right"
      dir="rtl"
      role="alert">
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        className="text-amber-600 mt-0.5 shrink-0"
        title="שמות כפולים"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-900 mb-2">זוהו מתנות עם אותו שם אורח (ייתכן כפילות)</p>
        <ul className="text-sm text-amber-950/90 space-y-1 list-disc list-inside">
          {groups.map((g) => (
            <li key={g.displayName}>
              <span className="font-medium">{g.displayName}</span>
              <span className="text-amber-800"> — {g.count} רשומות</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default GiftsGuestNameDuplicatesAlert
