import { LanguageDirection } from '@/types/General'
import { ENG } from './marketing.eng'
import { HEB } from './marketing.heb'

export const CONTACT_EMAIL = 'mazal18tov@gmail.com'

export type { MarketingCopy, MarketingFeature } from './marketing.heb'

export const getMarketingCopy = (direction: LanguageDirection): typeof HEB =>
  direction === LanguageDirection.HEB ? HEB : ENG
