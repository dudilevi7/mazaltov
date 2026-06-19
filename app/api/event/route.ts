import { forbidden, internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type EventRow, mapSupabaseEventRowToEventSettings, mapEventSettingsToSupabaseEventRow } from '@/types/event'
import type { EventSettings } from '@/types/Settings'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'
import { SupabaseClient } from '@supabase/supabase-js'

const getAuthUser = async (supabase: SupabaseClient, request: NextRequest) => {
  const accessToken = request.headers.get('X-Supabase-Auth')
  const { data } = await supabase.auth.getUser(accessToken ?? '')
  return data.user ?? null
}

// Creates the caller's own event (one per user) and an owner admin membership.
const bootstrapOwnEvent = async (
  supabase: SupabaseClient,
  userId: string,
  email: string,
  body: Partial<EventSettings>
) => {
  const row = {
    user_id: userId,
    ...mapEventSettingsToSupabaseEventRow(body ?? {}),
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await supabase.from('events').upsert(row, { onConflict: 'user_id' }).select().single()
  if (error || !data) return { data: null, error }

  await supabase
    .from('event_members')
    .insert({
      event_id: (data as EventRow).id,
      user_id: userId,
      email,
      role: 'admin',
      status: 'active',
      invited_by: userId,
    })
    .then(undefined, () => undefined)

  return { data: data as EventRow, error: null }
}

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[GET /api/event] No accessible event')
      return notFound('Event not found')
    }

    const { data, error } = await supabase.from('events').select('*').eq('id', ctx.eventId).maybeSingle()

    if (error) {
      Logger.error(`[GET /api/event] ${error.message ?? 'Failed to fetch event'}`)
      return internalServerError(error.message ?? 'Failed to fetch event')
    }
    if (!data) {
      Logger.error('[GET /api/event] Event not found')
      return notFound('Event not found')
    }

    Logger.info('[GET /api/event] Event fetched successfully', ctx.userId)
    return NextResponse.json(mapSupabaseEventRowToEventSettings(data as EventRow))
  } catch (error) {
    Logger.error(`[GET /api/event] ${error as string}`)
    return internalServerError(error as string)
  }
}

const upsertEvent = async (request: NextRequest, label: string) => {
  const supabase = await createSupabaseServerClient()
  const authUser = await getAuthUser(supabase, request)
  if (!authUser) {
    Logger.error(`[${label}] User id not found`)
    return unauthorized()
  }

  const body = await parseBody<EventSettings>(request)
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ message: 'No fields to update' }, { status: 400 })
  }

  const ctx = await getEventContext(supabase, request, authUser.id)

  // Brand-new user: create their own event + owner membership.
  if (!ctx) {
    const { data, error } = await bootstrapOwnEvent(supabase, authUser.id, authUser.email ?? '', body)
    if (error || !data) {
      Logger.error(`[${label}] ${error?.message ?? 'Failed to create event'}`)
      return internalServerError(error?.message ?? 'Failed to create event')
    }
    return NextResponse.json(mapSupabaseEventRowToEventSettings(data))
  }

  // Only admins may change event details. Editors are blocked.
  if (ctx.role !== 'admin') {
    Logger.error(`[${label}] Editor attempted to change event details`)
    return forbidden('Only admins can change event details')
  }

  const updates = { ...mapEventSettingsToSupabaseEventRow(body), updated_at: new Date().toISOString() }
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', ctx.eventId)
    .select()
    .maybeSingle()

  if (error) {
    Logger.error(`[${label}] ${error.message ?? 'Failed to update event'}`)
    return internalServerError(error.message ?? 'Failed to update event')
  }
  if (!data) {
    Logger.error(`[${label}] Event not found`)
    return notFound()
  }

  Logger.info(`[${label}] Event saved successfully`, ctx.userId)
  return NextResponse.json(mapSupabaseEventRowToEventSettings(data as EventRow))
}

export const POST = async (request: NextRequest) => {
  try {
    return await upsertEvent(request, 'POST /api/event')
  } catch (error) {
    Logger.error(`[POST /api/event] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    return await upsertEvent(request, 'PUT /api/event')
  } catch (error) {
    Logger.error(`[PUT /api/event] ${error as string}`)
    return internalServerError(error as string)
  }
}
