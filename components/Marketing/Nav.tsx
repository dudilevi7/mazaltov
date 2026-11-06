import Link from 'next/link'
import Logo from '@/components/AppHeader/Logo'
import LanguageToggle from '@/components/Shared/LanguageToggle'
import { LanguageDirection } from '@/types/General'
import type { MarketingCopy } from '@/constants/marketing'
import { LOGIN_PATH, PRIMARY_CTA_CLASS, scrollToTop } from './helper'

interface NavProps {
  copy: MarketingCopy
  isHebrew: boolean
  onLanguage: (direction: LanguageDirection) => void
}

const NAV_LINKS = [
  { href: '#about', key: 'about' },
  { href: '#features', key: 'features' },
  { href: '#recommendations', key: 'recommendations' },
  { href: '#connect', key: 'connect' },
] as const

const Nav = ({ copy, isHebrew, onLanguage }: NavProps) => (
  <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
      <Logo onClick={scrollToTop} />
      <nav className="hidden items-center gap-6 md:flex" aria-label={copy.nav.features}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-sm font-medium text-gray-700 transition hover:text-blue-600">
            {copy.nav[link.key]}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageToggle isHebrew={isHebrew} onLanguage={onLanguage} label={copy.hero.eyebrow} />
        <Link href={LOGIN_PATH} className="hidden text-sm font-medium text-gray-700 transition hover:text-blue-600 sm:inline">
          {copy.nav.login}
        </Link>
        <Link href={LOGIN_PATH} className={`${PRIMARY_CTA_CLASS} px-4 py-2 text-sm`}>
          {copy.nav.start}
        </Link>
      </div>
    </div>
    <nav className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-5 pb-3 md:hidden" aria-label={copy.nav.features}>
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href} className="shrink-0 text-sm font-medium text-gray-700">
          {copy.nav[link.key]}
        </a>
      ))}
      <Link href={LOGIN_PATH} className="shrink-0 text-sm font-medium text-gray-700 sm:hidden">
        {copy.nav.login}
      </Link>
    </nav>
  </header>
)

export default Nav
