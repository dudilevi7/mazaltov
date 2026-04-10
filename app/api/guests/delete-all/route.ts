import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/api/logger'

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[DELETE /api/guests/delete-all] User id not found')
      return unauthorized()
    }

    const { error } = await supabase.from('guests').delete().eq('user_id', userId)

    if (error) {
      Logger.error(`[DELETE /api/guests/delete-all] ${error.message ?? 'Failed to delete guests'}`)
      return internalServerError(error.message ?? 'Failed to delete guests')
    }

    Logger.info('[DELETE /api/guests/delete-all] All guests deleted successfully', userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/guests/delete-all] ${error as string}`)
    return internalServerError(error as string)
  }
}
