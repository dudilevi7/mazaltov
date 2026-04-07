import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type PublicNoteRow, mapPublicNoteRowToPublicNote, mapPublicNoteToPublicNoteRow } from '@/types/public-note-row'
import type { PublicNote } from '@/types/PublicNote'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[GET /api/public-notes] User id not found')
      return unauthorized()
    }

    const { data, error } = await supabase
      .from('public_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      Logger.error(`[GET /api/public-notes] ${error.message ?? 'Failed to fetch public notes'}`)
      return internalServerError(error.message ?? 'Failed to fetch public notes')
    }

    const notes = (data ?? []).map((row) => mapPublicNoteRowToPublicNote(row as PublicNoteRow))
    Logger.info('[GET /api/public-notes] Public notes fetched successfully', userId)
    return NextResponse.json(notes)
  } catch (error) {
    Logger.error(`[GET /api/public-notes] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[POST /api/public-notes] User id not found')
      return unauthorized()
    }

    const body = await parseBody<Omit<PublicNote, 'id' | 'createdAt' | 'updatedAt'>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const row = {
      user_id: userId,
      ...mapPublicNoteToPublicNoteRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('public_notes').insert(row).select().single()

    if (error) {
      Logger.error(`[POST /api/public-notes] ${error.message ?? 'Failed to create public note'}`)
      return internalServerError(error.message ?? 'Failed to create public note')
    }

    const note = mapPublicNoteRowToPublicNote(data as PublicNoteRow)
    Logger.info('[POST /api/public-notes] Public note created successfully', userId)
    return NextResponse.json(note)
  } catch (error) {
    Logger.error(`[POST /api/public-notes] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[DELETE /api/public-notes] User id not found')
      return unauthorized()
    }

    const idParam = request.nextUrl.searchParams.get('id')
    let id: string | null = idParam
    if (!id) {
      const body = await parseBody<{ id: string }>(request)
      id = body?.id ?? null
    }
    if (!id) {
      return NextResponse.json({ message: 'id required' }, { status: 400 })
    }

    const { error } = await supabase.from('public_notes').delete().eq('id', id).eq('user_id', userId)

    if (error) {
      Logger.error(`[DELETE /api/public-notes] ${error.message ?? 'Failed to delete public note'}`)
      return internalServerError(error.message ?? 'Failed to delete public note')
    }

    Logger.info('[DELETE /api/public-notes] Public note deleted successfully', userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    Logger.error(`[DELETE /api/public-notes] ${error as string}`)
    return internalServerError(error as string)
  }
}
