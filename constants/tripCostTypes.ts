import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBagShopping, faBus, faPhone, faReceipt, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { AdditionalCostType } from '@/types/Trip'
import type { SelectOption } from '@/components/Shared/SelectDropdown'

export const COST_TYPE_META: Record<
  AdditionalCostType,
  { he: string; en: string; icon: IconDefinition; color: string; pill: string }
> = {
  [AdditionalCostType.FOOD]: {
    he: 'אוכל',
    en: 'Food',
    icon: faUtensils,
    color: 'text-orange-500',
    pill: 'bg-orange-100 text-orange-800',
  },
  [AdditionalCostType.TRANSITIONS]: {
    he: 'תחבורה',
    en: 'Transport',
    icon: faBus,
    color: 'text-yellow-500',
    pill: 'bg-yellow-100 text-yellow-800',
  },
  [AdditionalCostType.SHOPPING]: {
    he: 'קניות',
    en: 'Shopping',
    icon: faBagShopping,
    color: 'text-violet-500',
    pill: 'bg-violet-100 text-violet-800',
  },
  [AdditionalCostType.COMMUNICATION]: {
    he: 'תקשורת',
    en: 'Communication',
    icon: faPhone,
    color: 'text-red-500',
    pill: 'bg-red-100 text-red-800',
  },
  [AdditionalCostType.OTHER]: {
    he: 'אחר',
    en: 'Other',
    icon: faReceipt,
    color: 'text-slate-500',
    pill: 'bg-slate-100 text-slate-700',
  },
}

export const getCostTypeOptions = (isRtl: boolean): SelectOption[] =>
  Object.values(AdditionalCostType).map((value) => ({
    value,
    label: isRtl ? COST_TYPE_META[value].he : COST_TYPE_META[value].en,
  }))

export const getCostTypeMeta = (costType?: AdditionalCostType) =>
  COST_TYPE_META[costType ?? AdditionalCostType.OTHER] ?? COST_TYPE_META[AdditionalCostType.OTHER]
