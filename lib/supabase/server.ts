import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants'

export const createSupabaseServerClient = async () => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
