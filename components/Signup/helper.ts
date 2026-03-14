import { PasswordRequirement, PasswordStrength } from './types'

const HAS_LOWERCASE = /[a-z]/
const HAS_UPPERCASE = /[A-Z]/
const HAS_DIGIT = /\d/
const HAS_SYMBOL = /[^A-Za-z0-9]/

export const getPasswordRequirements = (password: string): PasswordRequirement[] => [
  { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
  { id: 'lowercase', label: 'Lowercase letter', met: HAS_LOWERCASE.test(password) },
  { id: 'uppercase', label: 'Uppercase letter', met: HAS_UPPERCASE.test(password) },
  { id: 'digit', label: 'Digit (0-9)', met: HAS_DIGIT.test(password) },
  { id: 'symbol', label: 'Symbol (!@#$...)', met: HAS_SYMBOL.test(password) },
]

export const getPasswordStrength = (password: string): PasswordStrength => {
  const requirements = getPasswordRequirements(password)
  const metCount = requirements.filter((r) => r.met).length

  if (metCount <= 2) return 'weak'
  if (metCount <= 4) return 'medium'
  return 'strong'
}

export const allRequirementsMet = (password: string): boolean =>
  getPasswordRequirements(password).every((r) => r.met)

export const STRENGTH_CONFIG: Record<PasswordStrength, { label: string; color: string; barColor: string; width: string }> = {
  weak: { label: 'Weak', color: 'text-red-500', barColor: 'bg-red-500', width: 'w-1/3' },
  medium: { label: 'Medium', color: 'text-amber-500', barColor: 'bg-amber-500', width: 'w-2/3' },
  strong: { label: 'Strong', color: 'text-green-500', barColor: 'bg-green-500', width: 'w-full' },
}
