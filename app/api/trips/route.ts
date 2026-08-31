import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  type TripRow,
  mapTripRowToTrip,
  mapTripToTripRow,
  mapTripToTripRowForInsert,
  TRIP_TYPES,
} from '@/types/trip-row'
import type { Trip } from '@/types/Trip'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[GET /api/trips] No accessible event')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('event_id', ctx.eventId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/trips] ${error.message ?? 'Failed to fetch trips'}`)
      return internalServerError(error.message ?? 'Failed to fetch trips')
    }

    const trips = (data ?? []).map((row) => mapTripRowToTrip(row as TripRow))
    Logger.info('[GET /api/trips] Trips fetched successfully', ctx.userId)
    return NextResponse.json(trips)
  } catch (error) {
    Logger.error(`[GET /api/trips] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[POST /api/trips] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const tripType = body.tripType ?? 'other'
    if (!TRIP_TYPES.includes(tripType as (typeof TRIP_TYPES)[number])) {
      return NextResponse.json({ message: 'Invalid trip type' }, { status: 400 })
    }

    const row = {
      user_id: ctx.userId,
      event_id: ctx.eventId,
      ...mapTripToTripRowForInsert(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('trips').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/trips] ${error.message ?? 'Failed to create trip'}`)
      return internalServerError(error.message ?? 'Failed to create trip')
    }

    const trip = mapTripRowToTrip(data as TripRow)
    Logger.info('[POST /api/trips] Trip created successfully', ctx.userId)
    return NextResponse.json(trip)
  } catch (error) {
    Logger.error(`[POST /api/trips] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[PUT /api/trips] No accessible event')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    const id = idParam ? parseInt(idParam, 10) : null
    if (id === null || isNaN(id)) {
      return NextResponse.json({ message: 'id required in query params' }, { status: 400 })
    }

    const body = await parseBody<Partial<Trip>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    if (body.tripType && !TRIP_TYPES.includes(body.tripType as (typeof TRIP_TYPES)[number])) {
      return NextResponse.json({ message: 'Invalid trip type' }, { status: 400 })
    }

    const updates = {
      ...mapTripToTripRow(body),
      user_id: ctx.userId,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .eq('event_id', ctx.eventId)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/trips] ${error.message ?? 'Failed to update trip'}`)
      return internalServerError(error.message ?? 'Failed to update trip')
    }
    if (!data) {
      return notFound('Trip not found')
    }

    const trip = mapTripRowToTrip(data as TripRow)
    Logger.info('[PUT /api/trips] Trip updated successfully', ctx.userId)
    return NextResponse.json(trip)
  } catch (error) {
    Logger.error(`[PUT /api/trips] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[DELETE /api/trips] No accessible event')
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

    const { error } = await supabase.from('trips').delete().eq('id', id).eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/trips] ${error.message ?? 'Failed to delete trip'}`)
      return internalServerError(error.message ?? 'Failed to delete trip')
    }

    Logger.info('[DELETE /api/trips] Trip deleted successfully', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/trips] ${error as string}`)
    return internalServerError(error as string)
  }
}
