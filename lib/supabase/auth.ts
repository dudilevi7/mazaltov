import { NextRequest } from 'next/server'
import Logger from '../api/logger'
import { SupabaseClient } from '@supabase/supabase-js'
import { EventRole } from '@/types/eventMember'

export interface EventContext {
  userId: string
  eventId: string
  role: EventRole
}

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

// Resolves which event the request operates on and the caller's role for it.
// The active event is taken from the `X-Event-Id` header when the caller has
// access to it; otherwise it defaults to the event the caller owns, then to the
// first event they are an active member of. Returns null when the caller has no
// accessible event (e.g. a brand-new user who hasn't created one yet).
const getEventContext = async (
  supabase: SupabaseClient,
  request: NextRequest,
  userId?: string
): Promise<EventContext | null> => {
  const resolvedUserId = userId ?? (await getUserId(supabase, request))
  if (!resolvedUserId) {
    Logger.error('No user id found')
    return null
  }

  const accessibleUsersToEvent = new Map<string, EventRole>()
  const { data: owned } = await supabase.from('events').select('id').eq('user_id', resolvedUserId).maybeSingle()
  if (owned?.id) {
    return { userId: resolvedUserId, eventId: owned.id as string, role: EventRole.ADMIN }
  }

  const { data: memberships } = await supabase
    .from('event_members')
    .select('event_id, role')
    .eq('user_id', resolvedUserId)
    .eq('status', 'active')

  for (const membership of memberships ?? []) {
    const eventId = membership.event_id as string
    const role = membership.role as EventRole
    if (!accessibleUsersToEvent.has(eventId)) {
      accessibleUsersToEvent.set(eventId, role)
    }
  }

  if (accessibleUsersToEvent.size === 0) {
    return null
  }

  const requestedEventId = request.headers.get('X-Event-Id')
  let eventId = requestedEventId && accessibleUsersToEvent.has(requestedEventId) ? requestedEventId : null

  if (!eventId) {
    return null
  }

  const role = accessibleUsersToEvent.get(eventId) as EventRole
  if (!role) {
    return null
  }

  return { userId: resolvedUserId, eventId, role }
}

export { getUserId, getEventContext }
