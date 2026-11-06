'use client'

import { LanguageDirection } from '@/types/General'

interface LanguageToggleProps {
  isHebrew: boolean
  onLanguage: (direction: LanguageDirection) => void
  label?: string
}

const languageButtonClass = (active: boolean) =>
  `cursor-pointer rounded-full px-2.5 py-1 text-sm font-medium transition ${
    active ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white' : 'text-gray-600'
  }`

const LanguageToggle = ({ isHebrew, onLanguage, label }: LanguageToggleProps) => (
  <div className="flex rounded-full border border-gray-200 bg-gray-50 p-0.5" role="group" aria-label={label}>
    <button
      type="button"
      className={languageButtonClass(isHebrew)}
      onClick={() => onLanguage(LanguageDirection.HEB)}
      aria-pressed={isHebrew}>
      עב
    </button>
    <button
      type="button"
      className={languageButtonClass(!isHebrew)}
      onClick={() => onLanguage(LanguageDirection.ENG)}
      aria-pressed={!isHebrew}>
      EN
    </button>
  </div>
)

export default LanguageToggle
