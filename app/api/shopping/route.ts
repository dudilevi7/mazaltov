import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type ShoppingItemRow, mapShoppingRowToItem, mapItemToShoppingRow } from '@/types/shopping-row'
import type { ShoppingItem } from '@/types/ShoppingItem'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[GET /api/shopping] User id not found')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/shopping] ${error.message ?? 'Failed to fetch shopping items'}`)
      return internalServerError(error.message ?? 'Failed to fetch shopping items')
    }

    const items = (data ?? []).map((row) => mapShoppingRowToItem(row as ShoppingItemRow))
    Logger.info('[GET /api/shopping] Shopping items fetched successfully', userId)
    return NextResponse.json(items)
  } catch (error) {
    Logger.error(`[GET /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[POST /api/shopping] User id not found')
      return unauthorized()
    }

    const body = await parseBody<Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: userId,
      ...mapItemToShoppingRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('shopping_items').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/shopping] ${error.message ?? 'Failed to create shopping item'}`)
      return internalServerError(error.message ?? 'Failed to create shopping item')
    }

    const item = mapShoppingRowToItem(data as ShoppingItemRow)
    Logger.info('[POST /api/shopping] Shopping item created successfully', userId)
    return NextResponse.json(item)
  } catch (error) {
    Logger.error(`[POST /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[PUT /api/shopping] User id not found')
      return unauthorized()
    }

    const body = await parseBody<ShoppingItem>(request)
    if (!body || body.id == null) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    const updates = {
      ...mapItemToShoppingRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('shopping_items')
      .update(updates)
      .eq('id', body.id)
      .eq('user_id', userId)
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
    Logger.info('[PUT /api/shopping] Shopping item updated successfully', userId)
    return NextResponse.json(item)
  } catch (error) {
    Logger.error(`[PUT /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[DELETE /api/shopping] User id not found')
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

    const { error } = await supabase.from('shopping_items').delete().eq('id', id).eq('user_id', userId)

    if (error) {
      Logger.error(`[DELETE /api/shopping] ${error.message ?? 'Failed to delete shopping item'}`)
      return internalServerError(error.message ?? 'Failed to delete shopping item')
    }

    Logger.info('[DELETE /api/shopping] Shopping item deleted successfully', userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/shopping] ${error as string}`)
    return internalServerError(error as string)
  }
}
