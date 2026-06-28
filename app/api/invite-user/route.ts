import { forbidden, internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEventContext } from '@/lib/supabase/auth'
import { type EventMemberRow, mapEventMemberRowToEventMember, EventRole, EventMemberStatus } from '@/types/eventMember'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_ROLES: EventRole[] = [EventRole.ADMIN, EventRole.EDITOR]

type InviteBody = { email: string; role: EventRole }

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      return unauthorized()
    }
    if (ctx.role !== 'admin') {
      return forbidden('Only admins can invite users')
    }

    const body = await parseBody<InviteBody>(request)
    const email = body?.email?.trim().toLowerCase()
    const role = body?.role

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: 'A valid email is required' }, { status: 400 })
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Role must be admin or editor' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('event_members')
      .select('id')
      .eq('event_id', ctx.eventId)
      .ilike('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ message: 'This email is already invited' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('event_members')
      .insert({
        event_id: ctx.eventId,
        email,
        role,
        status: EventMemberStatus.PENDING,
        invited_by: ctx.userId,
      })
      .select()
      .single()

    if (error) {
      // Surfaced by the max-members trigger or unique index.
      const isLimit = /limit/i.test(error.message) || error.code === '23505'
      Logger.error(`[POST /api/invite-user] ${error.message}`)
      return NextResponse.json(
        { message: isLimit ? 'Member limit reached for this event' : error.message },
        { status: isLimit ? 409 : 500 }
      )
    }

    Logger.info('[POST /api/invite-user] Member invited', ctx.userId)
    return NextResponse.json(mapEventMemberRowToEventMember(data as EventMemberRow))
  } catch (error) {
    Logger.error(`[POST /api/invite-user] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) return unauthorized()
    if (ctx.role !== 'admin') return forbidden('Only admins can remove members')

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    // Prevent removing the owner (the member who is also the event's user_id).
    const { data: target } = await supabase
      .from('event_members')
      .select('user_id')
      .eq('id', id)
      .eq('event_id', ctx.eventId)
      .maybeSingle()

    if (target?.user_id) {
      const { data: ownerEvent } = await supabase.from('events').select('user_id').eq('id', ctx.eventId).maybeSingle()
      if (ownerEvent?.user_id === target.user_id) {
        return forbidden('Cannot remove the event owner')
      }
    }

    const { error } = await supabase.from('event_members').delete().eq('id', id).eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/invite-user] ${error.message}`)
      return internalServerError(error.message)
    }

    Logger.info('[DELETE /api/invite-user] Member removed', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/invite-user] ${error as string}`)
    return internalServerError(error as string)
  }
}
