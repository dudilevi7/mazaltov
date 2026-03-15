export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordRequirement {
  id: string
  label: string
  met: boolean
}
