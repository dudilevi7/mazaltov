import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type ShoppingItemRow, mapShoppingRowToItem, mapItemToShoppingRow } from '@/types/shopping-row'
import type { ShoppingItem } from '@/types/ShoppingItem'
import { getEventContext } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[GET /api/shopping] No accessible event')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('event_id', ctx.eventId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/shopping] ${error.message ?? 'Failed to fetch shopping items'}`)
      return internalServerError(error.message ?? 'Failed to fetch shopping items')
    }

    const items = (data ?? []).map((row) => mapShoppingRowToItem(row as ShoppingItemRow))
    Logger.info('[GET /api/shopping] Shopping items fetched successfully', ctx.userId)
    return NextResponse.json(items)
  } catch (error) {
    Logger.error(`[GET /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[POST /api/shopping] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: ctx.userId,
      event_id: ctx.eventId,
      ...mapItemToShoppingRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('shopping_items').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/shopping] ${error.message ?? 'Failed to create shopping item'}`)
      return internalServerError(error.message ?? 'Failed to create shopping item')
    }

    const item = mapShoppingRowToItem(data as ShoppingItemRow)
    Logger.info('[POST /api/shopping] Shopping item created successfully', ctx.userId)
    return NextResponse.json(item)
  } catch (error) {
    Logger.error(`[POST /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[PUT /api/shopping] No accessible event')
      return unauthorized()
    }

    const body = await parseBody<ShoppingItem>(request)
    if (!body || body.id == null) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    const updates = {
      ...mapItemToShoppingRow(body),
      user_id: ctx.userId,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('shopping_items')
      .update(updates)
      .eq('id', body.id)
      .eq('event_id', ctx.eventId)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/shopping] ${error.message ?? 'Failed to update shopping item'}`)
      return internalServerError(error.message ?? 'Failed to update shopping item')
    }
    if (!data) {
      return notFound('Shopping item not found')
    }

    const item = mapShoppingRowToItem(data as ShoppingItemRow)
    Logger.info('[PUT /api/shopping] Shopping item updated successfully', ctx.userId)
    return NextResponse.json(item)
  } catch (error) {
    Logger.error(`[PUT /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) {
      Logger.error('[DELETE /api/shopping] No accessible event')
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

    const { error } = await supabase.from('shopping_items').delete().eq('id', id).eq('event_id', ctx.eventId)

    if (error) {
      Logger.error(`[DELETE /api/shopping] ${error.message ?? 'Failed to delete shopping item'}`)
      return internalServerError(error.message ?? 'Failed to delete shopping item')
    }

    Logger.info('[DELETE /api/shopping] Shopping item deleted successfully', ctx.userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}
