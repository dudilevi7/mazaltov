import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type GuestRow, mapGuestRowToGuest, mapGuestToGuestRow } from '@/types/guest-row'
import type { Guest } from '@/types/Guest'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from '@/lib/api/modeling'
import Logger from '@/lib/api/logger'

type ImportBody = {
  guests: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>[]
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[POST /api/guests/import] User id not found')
      return unauthorized()
    }

    const body = await parseBody<ImportBody>(request)
    if (!body?.guests || !Array.isArray(body.guests) || body.guests.length === 0) {
      return NextResponse.json({ message: 'guests array is required' }, { status: 400 })
    }

    if (body.guests.length > 500) {
      return NextResponse.json({ message: 'Maximum 500 guests per import' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const rows = body.guests.map((g) => ({
      user_id: userId,
      ...mapGuestToGuestRow(g),
      updated_at: now,
    }))

    const { data, error } = await supabase.from('guests').insert(rows).select()

    if (error) {
      Logger.error(`[POST /api/guests/import] ${error.message ?? 'Failed to import guests'}`)
      return internalServerError(error.message ?? 'Failed to import guests')
    }

    const created = (data ?? []).map((row) => mapGuestRowToGuest(row as GuestRow))
    Logger.info(`[POST /api/guests/import] ${created.length} guests imported`, userId)
    return NextResponse.json(created)
  } catch (error) {
    Logger.error(`[POST /api/guests/import] ${error as string}`)
    return internalServerError(error as string)
  }
}
