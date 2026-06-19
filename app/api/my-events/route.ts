import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/supabase/auth'
import { EventRole, type AccessibleEvent } from '@/types/eventMember'
import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/api/logger'

// Lists every event the caller can access (owned + active memberships), with role.
export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) return unauthorized()

    const roleByEvent = new Map<string, EventRole>()
    const ownedIds = new Set<string>()

    const { data: owned } = await supabase.from('events').select('id').eq('user_id', userId).maybeSingle()
    if (owned?.id) {
      roleByEvent.set(owned.id as string, EventRole.ADMIN)
      ownedIds.add(owned.id as string)
    }

    const { data: memberships } = await supabase
      .from('event_members')
      .select('event_id, role')
      .eq('user_id', userId)
      .eq('status', 'active')

    for (const m of memberships ?? []) {
      const eventId = m.event_id as string
      if (!roleByEvent.has(eventId)) roleByEvent.set(eventId, m.role as EventRole)
    }

    const eventIds = [...roleByEvent.keys()]
    if (eventIds.length === 0) return NextResponse.json([])

    const { data: events, error } = await supabase
      .from('events')
      .select('id, event_type, owner_name, bride_name, groom_name')
      .in('id', eventIds)

    if (error) {
      Logger.error(`[GET /api/my-events] ${error.message}`)
      return internalServerError(error.message)
    }

    const result: AccessibleEvent[] = (events ?? []).map((e) => ({
      eventId: e.id as string,
      role: roleByEvent.get(e.id as string) ?? EventRole.EDITOR,
      isOwner: ownedIds.has(e.id as string),
      eventType: (e.event_type as string) ?? null,
      ownerName: (e.owner_name as string) ?? null,
      brideName: (e.bride_name as string) ?? null,
      groomName: (e.groom_name as string) ?? null,
    }))

    return NextResponse.json(result)
  } catch (error) {
    Logger.error(`[GET /api/my-events] ${error as string}`)
    return internalServerError(error as string)
  }
}
