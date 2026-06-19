import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type GiftRow, mapGiftRowToGift, mapGiftToGiftRow } from '@/types/gift-row'
import type { Gift } from '@/types/Gift'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[GET /api/gifts] No accessible event')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('event_id', ctx.eventId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/gifts] ${error.message ?? 'Failed to fetch gifts'}`)
      return internalServerError(error.message ?? 'Failed to fetch gifts')
    }

    const gifts = (data ?? []).map((row) => mapGiftRowToGift(row as GiftRow))
    Logger.info('[GET /api/gifts] Gifts fetched successfully', ctx.userId)
    return NextResponse.json(gifts)
  } catch (error) {
    Logger.error(`[GET /api/gifts] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[POST /api/gifts] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: ctx.userId,
      event_id: ctx.eventId,
      ...mapGiftToGiftRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('gifts').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/gifts] ${error.message ?? 'Failed to create gift'}`)
      return internalServerError(error.message ?? 'Failed to create gift')
    }

    const gift = mapGiftRowToGift(data as GiftRow)
    Logger.info('[POST /api/gifts] Gift created successfully', ctx.userId)
    return NextResponse.json(gift)
  } catch (error) {
    Logger.error(`[POST /api/gifts] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[PUT /api/gifts] No accessible event')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    const id = idParam ? parseInt(idParam, 10) : null
    if (id === null || isNaN(id)) {
      return NextResponse.json({ message: 'id required in query params' }, { status: 400 })
    }

    const body = await parseBody<Partial<Gift>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const updates = {
      ...mapGiftToGiftRow(body),
      user_id: ctx.userId,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('gifts')
      .update(updates)
      .eq('id', id)
      .eq('event_id', ctx.eventId)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/gifts] ${error.message ?? 'Failed to update gift'}`)
      return internalServerError(error.message ?? 'Failed to update gift')
    }
    if (!data) {
      return notFound('Gift not found')
    }

    const gift = mapGiftRowToGift(data as GiftRow)
    Logger.info('[PUT /api/gifts] Gift updated successfully', ctx.userId)
    return NextResponse.json(gift)
  } catch (error) {
    Logger.error(`[PUT /api/gifts] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[DELETE /api/gifts] No accessible event')
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

    const { error } = await supabase.from('gifts').delete().eq('id', id).eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/gifts] ${error.message ?? 'Failed to delete gift'}`)
      return internalServerError(error.message ?? 'Failed to delete gift')
    }

    Logger.info('[DELETE /api/gifts] Gift deleted successfully', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/gifts] ${error as string}`)
    return internalServerError(error as string)
  }
}
