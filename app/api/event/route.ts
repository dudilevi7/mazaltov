import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type EventRow, mapSupabaseEventRowToEventSettings, mapEventSettingsToSupabaseEventRow } from '@/types/event'
import type { EventSettings } from '@/types/Settings'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[GET /api/event] User id not found')
      return unauthorized()
    }

    const { data, error } = await supabase.from('events').select('*').eq('user_id', userId).limit(1).maybeSingle()

    if (error) {
      Logger.error(`[GET /api/event] ${error.message ?? 'Failed to fetch event'}`)
      return internalServerError(error.message ?? 'Failed to fetch event')
    }
    if (!data) {
      Logger.error('[GET /api/event] Event not found')
      return notFound('Event not found')
    }

    Logger.info('[GET /api/event] Event fetched successfully', userId)
    return NextResponse.json(mapSupabaseEventRowToEventSettings(data as EventRow))
  } catch (error) {
    Logger.error(`[GET /api/event] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[POST /api/event] User id not found')
      return unauthorized()
    }

    const body = await parseBody<EventSettings>(request)
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'No fields to create event' }, { status: 400 })
    }
    const row = {
      user_id: userId,
      ...mapEventSettingsToSupabaseEventRow(body ?? {}),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('events').upsert(row, { onConflict: 'user_id' }).select().single()

    if (error) {
      Logger.error(`[POST /api/event] ${error.message ?? 'Failed to upsert event'}`)
      return internalServerError(error.message ?? 'Failed to upsert event')
    }

    const eventSettings = mapSupabaseEventRowToEventSettings(data as EventRow)
    Logger.info('[POST /api/event] Event created successfully', userId)
    return NextResponse.json(eventSettings)
  } catch (error) {
    Logger.error(`[POST /api/event] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[PUT /api/event] User id not found')
      return unauthorized()
    }

    const body = await parseBody<EventSettings>(request)
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 })
    }

    const updates = { ...mapEventSettingsToSupabaseEventRow(body), updated_at: new Date().toISOString() }

    const { data, error } = await supabase
      .from('events')
      .upsert(
        {
          ...updates,
          user_id: userId,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .maybeSingle()

    if (error) {
      return NextResponse.json({ message: error.message ?? 'Failed to update event' }, { status: 500 })
    }
    if (!data) {
      Logger.error('[PUT /api/event] Event not found')
      return notFound()
    }
    const eventSettings = mapSupabaseEventRowToEventSettings(data as EventRow)
    Logger.info('[PUT /api/event] Event updated successfully', userId)
    return NextResponse.json(eventSettings)
  } catch (error) {
    Logger.error(`[PUT /api/event] ${error as string}`)
    return internalServerError(error as string)
  }
}
