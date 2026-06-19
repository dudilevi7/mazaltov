import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/api/logger'

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[DELETE /api/guests/delete-all] No accessible event')
      return unauthorized()
    }

    const { error } = await supabase.from('guests').delete().eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/guests/delete-all] ${error.message ?? 'Failed to delete guests'}`)
      return internalServerError(error.message ?? 'Failed to delete guests')
    }

    Logger.info('[DELETE /api/guests/delete-all] All guests deleted successfully', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/guests/delete-all] ${error as string}`)
    return internalServerError(error as string)
  }
}
