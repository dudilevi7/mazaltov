import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {
  faMusic,
  faCamera,
  faWineGlass,
  faLandmark,
  faPersonDress,
  faUserTie,
  faPalette,
  faGem,
  faBus,
  faScroll,
  faGift,
  faBed,
  faPaintBrush,
  faScissors,
  faClipboardCheck,
  faChair,
} from '@fortawesome/free-solid-svg-icons'
import type { SelectOption } from '@/components/Shared/SelectDropdown'

export interface SuggestedService {
  enLabel: string
  hebLabel: string
  icon: IconDefinition
  color: string
}

export const SUGGESTED_SERVICES: SuggestedService[] = [
  { enLabel: 'DJ', hebLabel: 'DJ', icon: faMusic, color: 'text-purple-500' },
  { enLabel: 'Photography', hebLabel: 'צילום', icon: faCamera, color: 'text-blue-500' },
  { enLabel: 'Alcohol', hebLabel: 'אלכוהול', icon: faWineGlass, color: 'text-rose-500' },
  { enLabel: 'Hall', hebLabel: 'אולם', icon: faLandmark, color: 'text-amber-600' },
  { enLabel: 'Bridal wear', hebLabel: 'לבוש כלה', icon: faPersonDress, color: 'text-pink-400' },
  { enLabel: 'Groom wear', hebLabel: 'לבוש חתן', icon: faUserTie, color: 'text-slate-600' },
  { enLabel: 'Hall Design', hebLabel: 'עיצוב אולם', icon: faPalette, color: 'text-teal-500' },
  { enLabel: 'Jewelry', hebLabel: 'תכשיטים', icon: faGem, color: 'text-yellow-500' },
  { enLabel: 'Transportation', hebLabel: 'הסעות', icon: faBus, color: 'text-green-600' },
  { enLabel: 'Rabanut/Marriage Authority', hebLabel: 'רבנות/מוסד נישואין', icon: faScroll, color: 'text-indigo-500' },
  { enLabel: 'Guest gifts', hebLabel: 'מתנות לאורחים', icon: faGift, color: 'text-red-400' },
  { enLabel: 'Accommodation', hebLabel: 'מקום אירוח', icon: faBed, color: 'text-cyan-600' },
  { enLabel: 'Makeup', hebLabel: 'איפור', icon: faPaintBrush, color: 'text-fuchsia-500' },
  { enLabel: 'Hair design', hebLabel: 'עיצוב שיער', icon: faScissors, color: 'text-orange-500' },
  { enLabel: 'Arrival confirmations', hebLabel: 'אישורי הגעה', icon: faClipboardCheck, color: 'text-emerald-500' },
  { enLabel: 'Seating', hebLabel: 'סידורי הושבה', icon: faChair, color: 'text-violet-500' },
]

export const SUGGESTED_SERVICES_OPTIONS: SelectOption[] = SUGGESTED_SERVICES.map((s) => ({
  value: s.hebLabel,
  label: s.hebLabel,
}))

const suggestedServiceMap = new Map<string, SuggestedService>(SUGGESTED_SERVICES.map((s) => [s.hebLabel, s]))

export const getSuggestedServiceByLabel = (hebLabel: string): SuggestedService | undefined =>
  suggestedServiceMap.get(hebLabel)
