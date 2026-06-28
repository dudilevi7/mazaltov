import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEventContext } from '@/lib/supabase/auth'
import { type EventMemberRow, mapEventMemberRowToEventMember } from '@/types/eventMember'
import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('event_members')
      .select('*')
      .eq('event_id', ctx.eventId)
      .order('created_at', { ascending: true })

    if (error) {
      Logger.error(`[GET /api/event-members] ${error.message}`)
      return internalServerError(error.message)
    }

    const members = (data ?? []).map((row) => mapEventMemberRowToEventMember(row as EventMemberRow))
    return NextResponse.json(members)
  } catch (error) {
    Logger.error(`[GET /api/event-members] ${error as string}`)
    return internalServerError(error as string)
  }
}
