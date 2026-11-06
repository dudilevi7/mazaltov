import Link from 'next/link'
import Logo from '@/components/AppHeader/Logo'
import type { MarketingCopy } from '@/constants/marketing'
import { LOGIN_PATH, scrollToTop } from './helper'

interface FooterProps {
  copy: MarketingCopy
}

const LINKS = [
  { href: '#about', key: 'about' },
  { href: '#features', key: 'features' },
  { href: '#recommendations', key: 'recommendations' },
  { href: '#connect', key: 'connect' },
] as const

const Footer = ({ copy }: FooterProps) => (
  <footer className="border-t border-gray-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Logo onClick={scrollToTop} />
        <p className="mt-2 text-sm font-medium text-blue-600">{copy.footer.line}</p>
      </div>
      <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-blue-600">
            {copy.nav[link.key]}
          </a>
        ))}
        <Link href={LOGIN_PATH} className="hover:text-blue-600">
          {copy.nav.login}
        </Link>
      </nav>
    </div>
  </footer>
)

export default Footer
