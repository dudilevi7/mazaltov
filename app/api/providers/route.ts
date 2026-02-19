import { internalServerError, notFound, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type ProviderRow, mapProviderRowToProvider, mapProviderToProviderRow } from '@/types/provider-row'
import type { Provider } from '@/types/Provider'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[GET /api/providers] User id not found')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/providers] ${error.message ?? 'Failed to fetch providers'}`)
      return internalServerError(error.message ?? 'Failed to fetch providers')
    }

    const providers = (data ?? []).map((row) => mapProviderRowToProvider(row as ProviderRow))
    Logger.info('[GET /api/providers] Providers fetched successfully', userId)
    return NextResponse.json(providers)
  } catch (error) {
    Logger.error(`[GET /api/providers] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[POST /api/providers] User id not found')
      return unauthorized()
    }

    const body = await parseBody<Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: userId,
      ...mapProviderToProviderRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('providers').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/providers] ${error.message ?? 'Failed to create provider'}`)
      return internalServerError(error.message ?? 'Failed to create provider')
    }

    const provider = mapProviderRowToProvider(data as ProviderRow)
    Logger.info('[POST /api/providers] Provider created successfully', userId)
    return NextResponse.json(provider)
  } catch (error) {
    Logger.error(`[POST /api/providers] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[PUT /api/providers] User id not found')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    const id = idParam ? parseInt(idParam, 10) : null
    if (id === null || isNaN(id)) {
      return NextResponse.json({ message: 'id required in query params' }, { status: 400 })
    }

    const body = await parseBody<Partial<Provider>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const updates = {
      ...mapProviderToProviderRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('providers')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/providers] ${error.message ?? 'Failed to update provider'}`)
      return internalServerError(error.message ?? 'Failed to update provider')
    }
    if (!data) {
      return notFound('Provider not found')
    }

    const provider = mapProviderRowToProvider(data as ProviderRow)
    Logger.info('[PUT /api/providers] Provider updated successfully', userId)
    return NextResponse.json(provider)
  } catch (error) {
    Logger.error(`[PUT /api/providers] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[DELETE /api/providers] User id not found')
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

    const { error } = await supabase.from('providers').delete().eq('id', id).eq('user_id', userId)

    if (error) {
      Logger.error(`[DELETE /api/providers] ${error.message ?? 'Failed to delete provider'}`)
      return internalServerError(error.message ?? 'Failed to delete provider')
    }

    Logger.info('[DELETE /api/providers] Provider deleted successfully', userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/providers] ${error as string}`)
    return internalServerError(error as string)
  }
}
