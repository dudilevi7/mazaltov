import { internalServerError, notFound } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type PublicNoteRow, mapPublicNoteRowToPublicNote, mapPublicNoteToPublicNoteRow } from '@/types/public-note-row'
import type { PublicNote } from '@/types/PublicNote'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

type RouteParams = { params: Promise<{ id: string }> }

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('public_notes')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      Logger.error(`[GET /api/public-notes/${id}] ${error.message}`)
      return internalServerError(error.message)
    }
    if (!data) {
      return notFound('Public note not found')
    }

    const note = mapPublicNoteRowToPublicNote(data as PublicNoteRow)
    return NextResponse.json(note)
  } catch (error) {
    Logger.error(`[GET /api/public-notes/[id]] ${error as string}`)
    return internalServerError(error as string)
  }
}

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()

    const body = await parseBody<Partial<PublicNote>>(request)
    if (!body) {
      return NextResponse.json({ message: 'No body' }, { status: 400 })
    }

    const updates = {
      ...mapPublicNoteToPublicNoteRow(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('public_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      Logger.error(`[PUT /api/public-notes/${id}] ${error.message}`)
      return internalServerError(error.message)
    }
    if (!data) {
      return notFound('Public note not found')
    }

    const note = mapPublicNoteRowToPublicNote(data as PublicNoteRow)
    return NextResponse.json(note)
  } catch (error) {
    Logger.error(`[PUT /api/public-notes/[id]] ${error as string}`)
    return internalServerError(error as string)
  }
}
