'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { getMarketingCopy } from '@/constants/marketing'
import { LanguageDirection } from '@/types/General'
import Nav from './Nav'
import Hero from './Hero'
import About from './About'
import Features from './Features'
import Recommendations from './Recommendations'
import Connect from './Connect'
import Footer from './Footer'

interface MarketingProps {
  fontClassName: string
}

const Marketing = ({ fontClassName }: MarketingProps) => {
  const { setLanguageDirection } = useAppContext()
  const [language, setLanguage] = useState<LanguageDirection>(LanguageDirection.HEB)
  const isHebrew = language === LanguageDirection.HEB
  const copy = getMarketingCopy(language)

  useEffect(() => {
    setLanguageDirection(language)
  }, [language, setLanguageDirection])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollBehavior = previous
    }
  }, [])

  return (
    <div dir={language} lang={isHebrew ? 'he' : 'en'} className={`${fontClassName} min-h-screen bg-white text-gray-900`}>
      <Nav copy={copy} isHebrew={isHebrew} onLanguage={setLanguage} />
      <main>
        <Hero copy={copy} />
        <About copy={copy} />
        <Features copy={copy} />
        <Recommendations copy={copy} />
        <Connect copy={copy} />
      </main>
      <Footer copy={copy} />
    </div>
  )
}

export default Marketing
