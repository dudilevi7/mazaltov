import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type GuestRow, mapGuestRowToGuest, mapGuestToGuestRow } from '@/types/guest-row'
import type { Guest } from '@/types/Guest'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[GET /api/guests] No accessible event')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', ctx.eventId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/guests] ${error.message ?? 'Failed to fetch guests'}`)
      return internalServerError(error.message ?? 'Failed to fetch guests')
    }

    const guests = (data ?? []).map((row) => mapGuestRowToGuest(row as GuestRow))
    Logger.info('[GET /api/guests] Guests fetched successfully', ctx.userId)
    return NextResponse.json(guests)
  } catch (error) {
    Logger.error(`[GET /api/guests] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[POST /api/guests] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: ctx.userId,
      event_id: ctx.eventId,
      ...mapGuestToGuestRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('guests').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/guests] ${error.message ?? 'Failed to create guest'}`)
      return internalServerError(error.message ?? 'Failed to create guest')
    }

    const guest = mapGuestRowToGuest(data as GuestRow)
    Logger.info('[POST /api/guests] Guest created successfully', ctx.userId)
    return NextResponse.json(guest)
  } catch (error) {
    Logger.error(`[POST /api/guests] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[PUT /api/guests] No accessible event')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    const id = idParam ? parseInt(idParam, 10) : null
    if (id === null || isNaN(id)) {
      return NextResponse.json({ message: 'id required in query params' }, { status: 400 })
    }

    const body = await parseBody<Partial<Guest>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const updates = {
      ...mapGuestToGuestRow(body),
      user_id: ctx.userId,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .eq('event_id', ctx.eventId)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/guests] ${error.message ?? 'Failed to update guest'}`)
      return internalServerError(error.message ?? 'Failed to update guest')
    }
    if (!data) {
      return notFound('Guest not found')
    }

    const guest = mapGuestRowToGuest(data as GuestRow)
    Logger.info('[PUT /api/guests] Guest updated successfully', ctx.userId)
    return NextResponse.json(guest)
  } catch (error) {
    Logger.error(`[PUT /api/guests] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[DELETE /api/guests] No accessible event')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    let id: number | null = idParam ? parseInt(idParam, 10) : null
    if (id === null || isNaN(id)) {
      const body = await parseBody<{ id: number }>(request)
      id = body?.id ?? null
    }
    if (id === null || isNaN(id)) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    const { error } = await supabase.from('guests').delete().eq('id', id).eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/guests] ${error.message ?? 'Failed to delete guest'}`)
      return internalServerError(error.message ?? 'Failed to delete guest')
    }

    Logger.info('[DELETE /api/guests] Guest deleted successfully', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/guests] ${error as string}`)
    return internalServerError(error as string)
  }
}
