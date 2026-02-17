import { NextRequest } from 'next/server'
import Logger from '../api/logger'
import { SupabaseClient } from '@supabase/supabase-js'

const getUserId = async (supabase: SupabaseClient, request: NextRequest) => {
  const accessToken = request.headers.get('X-Supabase-Auth')
  try {
    Logger.debug('Getting user id from db')
    const user = await supabase.auth.getUser(accessToken ?? '')
    if (!user) {
      Logger.error('Failed to get user id from db')
      throw new Error('Failed to get user id from db')
    }
    Logger.info('User id fetched from db', user.data.user?.id)
    return user.data.user?.id
  } catch (error) {
    Logger.error(error as string)
    throw error
  }
}

export { getUserId }
