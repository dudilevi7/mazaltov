import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRing } from '@fortawesome/free-solid-svg-icons'
import type { MarketingCopy, MarketingFeature } from '@/constants/marketing'
import { LOGIN_PATH, PRIMARY_CTA_CLASS, SECONDARY_CTA_CLASS } from './helper'
import PointList from './PointList'

interface HeroProps {
  copy: MarketingCopy
}

const StageCard = ({ item, index }: { item: MarketingFeature; index: number }) => (
  <li className="motion-safe:animate-rise" style={{ animationDelay: `${180 + index * 120}ms` }}>
    <a
      href={`#${item.id}`}
      className="block cursor-pointer rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/70 transition hover:-translate-y-1 hover:shadow-blue-200/80">
      <p className="text-base font-semibold leading-snug text-balance">{item.title}</p>
      <PointList points={item.points} />
    </a>
  </li>
)

const Hero = ({ copy }: HeroProps) => (
  <section className="relative overflow-hidden bg-white">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-24 h-80 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.18),transparent_62%)]"
    />
    <div aria-hidden className="pointer-events-none absolute -start-16 top-32 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />
    <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-12 lg:grid-cols-2 lg:gap-16 lg:pb-12 lg:pt-16">
      <div className="motion-safe:animate-rise">
        <p className="text-sm font-semibold text-blue-600">{copy.hero.eyebrow}</p>
        <span className="mt-4 block h-1 w-14 rounded-full bg-linear-to-r from-blue-500 to-blue-300" aria-hidden />
        <h1 className="mt-5 text-4xl font-semibold leading-[1.15] text-balance sm:text-5xl">{copy.hero.headline}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">{copy.hero.support}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={LOGIN_PATH} className={PRIMARY_CTA_CLASS}>
            {copy.nav.start}
          </Link>
          <a href="#connect" className={`${SECONDARY_CTA_CLASS} transition hover:-translate-y-0.5`}>
            {copy.hero.connect}
          </a>
        </div>
      </div>
      <div className="relative">
        <FontAwesomeIcon
          icon={faRing}
          aria-hidden
          className="pointer-events-none absolute -top-6 end-2 text-[6.5rem] text-blue-200 motion-safe:animate-float"
        />
        <ul className="relative grid gap-3">
          {copy.features.items.map((item, index) => (
            <StageCard key={item.id} item={item} index={index} />
          ))}
        </ul>
      </div>
    </div>
    <div className="relative border-t border-blue-100 bg-linear-to-r from-blue-50 via-white to-blue-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-medium">{copy.eventsLead}</p>
        <ul className="flex flex-wrap gap-2">
          {copy.events.map((event) => (
            <li
              key={event.id}
              className="rounded-full border border-blue-100 bg-white px-3 py-1 text-sm text-gray-700 transition hover:-translate-y-0.5 hover:border-blue-300">
              {event.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
)

export default Hero
