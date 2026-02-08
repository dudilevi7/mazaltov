import { PaidFilterStatus, Provider } from '@/types/Provider'
import { SelectOption } from '../Shared/SelectDropdown'

const getWhatsappUrl = (phone: string) => {
  if (!phone) return ''
  let cleanedPhone = phone
  cleanedPhone = cleanedPhone.replace(/\D/g, '')
  cleanedPhone = cleanedPhone.replaceAll('-', '').replaceAll(' ', '').replaceAll('+972', '0')
  return `https://wa.me/${cleanedPhone}`
}
const PHONE_NUMBER_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/

const validatePhoneNumber = (phone?: string) => {
  if (!phone) return true
  let cleanedPhone = phone
  cleanedPhone = cleanedPhone.replaceAll('-', '').replaceAll(' ', '').replaceAll('+972', '0')
  cleanedPhone = cleanedPhone.replace(/\D/g, '')
  return PHONE_NUMBER_REGEX.test(cleanedPhone)
}

const getMobileUrl = (phone: string) => {
  if (!phone) return ''
  let cleanedPhone = phone
  cleanedPhone = cleanedPhone.replace(/\D/g, '')
  cleanedPhone = cleanedPhone.replaceAll('-', '').replaceAll(' ', '').replaceAll('+972', '0')
  return `tel:${cleanedPhone}`
}

const getIsPaid = (provider: Provider, paidFilterStatus: PaidFilterStatus) => {
  switch (paidFilterStatus) {
    case PaidFilterStatus.PAID:
      return provider.toBePaid === 0
    case PaidFilterStatus.NOT_PAID:
      return provider.toBePaid > 0
    default:
      return true
  }
}
const paidStatusToDisplayName: Record<PaidFilterStatus, string> = {
  [PaidFilterStatus.ALL]: 'הכל',
  [PaidFilterStatus.PAID]: 'שולם',
  [PaidFilterStatus.NOT_PAID]: 'לא שולם',
}
const paidStatusOptions: SelectOption[] = [
  { value: PaidFilterStatus.ALL, label: paidStatusToDisplayName[PaidFilterStatus.ALL] },
  { value: PaidFilterStatus.PAID, label: paidStatusToDisplayName[PaidFilterStatus.PAID] },
  { value: PaidFilterStatus.NOT_PAID, label: paidStatusToDisplayName[PaidFilterStatus.NOT_PAID] },
]
export { getWhatsappUrl, validatePhoneNumber, getMobileUrl, getIsPaid, paidStatusOptions }
