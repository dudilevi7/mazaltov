import { CONTACT_EMAIL, type MarketingCopy } from '@/constants/marketing'

export const LOGIN_PATH = '/login'

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const PRIMARY_CTA_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-medium text-white shadow-md shadow-blue-500/25 transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700'

export const SECONDARY_CTA_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-900 hover:border-blue-200 hover:bg-blue-50'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactFields {
  name: string
  email: string
  eventId: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactFields, string>>

export const splitPoint = (point: string) => {
  const [label, note] = point.split(' — ')
  return { label, note }
}

export const validateContact = (fields: ContactFields, errors: MarketingCopy['connect']['errors']): ContactErrors => {
  const next: ContactErrors = {}
  if (!fields.name.trim()) next.name = errors.name
  if (!EMAIL_PATTERN.test(fields.email.trim())) next.email = errors.email
  if (!fields.eventId) next.eventId = errors.event
  if (!fields.message.trim()) next.message = errors.message
  return next
}

interface MailtoInput {
  name: string
  email: string
  eventLabel: string
  message: string
  subject: string
}

export const buildContactMailto = ({ name, email, eventLabel, message, subject }: MailtoInput) => {
  const body = [name.trim(), email.trim(), eventLabel, '', message.trim()].join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
