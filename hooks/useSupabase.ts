'use client'

import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface UseSupabaseReturn {
  isLoading: boolean
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const useSupabase = (): UseSupabaseReturn => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const getSession = async () => {
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession()
    setSession(supabaseSession)
    setUser(supabaseSession?.user ?? null)
    setIsLoading(false)
  }
  const onAuthStateChange = (event: string, supabaseSession: Session | null) => {
    setSession(supabaseSession)
    setUser(supabaseSession?.user ?? null)
    setIsLoading(false)
  }

  useEffect(() => {
    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(onAuthStateChange)

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ?? null }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    return { error: error ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    isLoading,
    user,
    session,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }
}

export default useSupabase
