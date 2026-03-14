'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUserPlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import useSupabase from '@/hooks/useSupabase'
import Logo from '../AppHeader/Logo'
import { getPasswordRequirements, getPasswordStrength, allRequirementsMet, STRENGTH_CONFIG } from './helper'
import CustomButton from '../Button/custom-button'

const Signup = () => {
  const { signUp, isAuthenticated } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const requirements = getPasswordRequirements(password)
  const strength = getPasswordStrength(password)
  const strengthConfig = STRENGTH_CONFIG[strength]

  const isRequirementsMet = useMemo(() => allRequirementsMet(password), [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setWarning(null)

    if (!isRequirementsMet) {
      setError('Password does not meet all requirements')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (strength === 'weak') {
      setWarning('Consider using a stronger password')
    }

    setIsSubmitting(true)
    const { error: err } = await signUp(email, password)
    setIsSubmitting(false)

    if (err) {
      setError(err.message)
      return
    }

    setSuccess(true)
  }

  if (isAuthenticated) {
    return <div className="flex flex-col min-h-screen bg-gray-50" />
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 px-4 animate-fade-in-0.5">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <Logo className="" />
          <div className="mt-4 rounded-lg border border-dashed border-green-600 px-4 py-3 text-sm text-green-700 flex flex-col gap-2">
            <span> Account created! Check your email to confirm your account. </span>
            <div className="h-[2px] w-[70%] mx-auto bg-linear-to-r from-green-600 to-green-700 rounded-full" />
            <span>בקשה לאימות נשלחה לאימייל שלך</span>
          </div>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            Go to Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 px-4 animate-fade-in-0.5">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Logo className="" />
          <p className="mt-1 text-sm text-gray-500">Sign up to manage your event</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-gray-700">
              Email | אימייל
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              </span>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-gray-700">
              Password | סיסמה
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
              </span>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                placeholder="••••••••"
              />
            </div>

            {password.length > 0 && (
              <div className="mt-2 space-y-2 animate-fade-in-0.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthConfig.barColor} ${strengthConfig.width}`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${strengthConfig.color} transition-colors duration-300`}>
                    {strengthConfig.label}
                  </span>
                </div>

                <ul className="space-y-1">
                  {requirements.map((req) => (
                    <li key={req.id} className="flex items-center gap-1.5 text-xs">
                      <FontAwesomeIcon
                        icon={req.met ? faCheck : faXmark}
                        className={`h-3 w-3 transition-colors duration-200 ${req.met ? 'text-green-500' : 'text-gray-400'}`}
                      />
                      <span className={req.met ? 'text-green-600' : 'text-gray-500'}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="signup-confirm" className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password | אימות סיסמה
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
              </span>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                placeholder="••••••••"
              />
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-500 animate-fade-in-0.5">Passwords do not match</p>
            )}
          </div>

          {warning && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-600" role="alert">
              {warning}
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <CustomButton
            type="submit"
            disabled={
              isSubmitting || !isRequirementsMet || (password.length > 0 && password !== confirmPassword) || !email
            }
            className="w-full flex items-center justify-center !gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-700
              px-4 py-2.5 font-medium text-white transition hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 cursor-pointer"
            icon={<FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </CustomButton>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Sign in | התחבר
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
