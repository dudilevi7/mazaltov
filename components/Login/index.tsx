'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import useSupabase from '@/hooks/useSupabase'
import Logo from '../AppHeader/Logo'
import CustomButton from '../Button/custom-button'

const Login = () => {
  const { signIn, isAuthenticated } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const { error: err } = await signIn(email, password)
    setIsSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
  }

  if (isAuthenticated) {
    return <div className="flex flex-col min-h-screen bg-gray-50" />
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 px-4 animate-fade-in-0.5">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Logo className="" />
          <p className="mt-1 text-sm text-gray-500">Sign in to manage your event</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email | אימייל
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              </span>
              <input
                id="email"
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
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password | סיסמה
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <CustomButton
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center !gap-2 rounded-lg bg-linear-to-r from-blue-500 to-blue-700
              px-4 py-2.5 font-medium text-white transition hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 cursor-pointer"
            icon={<FontAwesomeIcon icon={faRightToBracket} className="h-4 w-4" />}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </CustomButton>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Sign up | הירשם
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
