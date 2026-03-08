import { unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUserId } from '@/lib/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/api/logger'

const BUCKET = 'invitations'
const OBJECT_NAME = 'invitation'

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[GET /api/invitation] User id not found')
      return unauthorized()
    }
    const { data } = await supabase.storage.from(BUCKET).getPublicUrl(`${userId}/${OBJECT_NAME}`)
    const url = `${data.publicUrl}?t=${Date.now()}`
    return NextResponse.json({ url })
  } catch (error) {
    Logger.error(`[GET /api/invitation] ${error as string}`)
    return unauthorized()
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[POST /api/invitation] User id not found')
      return unauthorized()
    }
    console.log(request.headers.get('content-type'))
    const formData = (await request.formData()) as FormData

    const file = formData.get('file') as File

    if (!file) {
      throw new Error('File not found')
    }

    const { data, error } = await supabase.storage.from(BUCKET).upload(`${userId}/${OBJECT_NAME}`, file, {
      upsert: true,
    })
    if (error) {
      Logger.error(`[POST /api/invitation] ${error.message}`)
      return unauthorized()
    }
    const url = await supabase.storage.from(BUCKET).getPublicUrl(`${userId}/${OBJECT_NAME}`)
    const imageUrl = `${url.data.publicUrl}?t=${Date.now()}`
    return NextResponse.json({ message: 'Invitation created', url: imageUrl })
  } catch (error) {
    Logger.error(`[POST /api/invitation] ${error as string}`)
    return unauthorized()
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const userId = await getUserId(supabase, request)
    if (!userId) {
      Logger.error('[PUT /api/invitation] User id not found')
      return unauthorized()
    }
    const formData = (await request.formData()) as FormData
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('File not found')
    }
    const { data, error } = await supabase.storage.from(BUCKET).update(`${userId}/${OBJECT_NAME}`, file, {
      upsert: true,
      cacheControl: '0',
    })
    if (error) {
      Logger.error(`[PUT /api/invitation] ${error.message}`)
      return unauthorized()
    }
    const url = await supabase.storage.from(BUCKET).getPublicUrl(`${userId}/${OBJECT_NAME}`)
    const imageUrl = `${url.data.publicUrl}?t=${Date.now()}`
    return NextResponse.json({ message: 'Invitation updated', url: imageUrl })
  } catch (error) {
    Logger.error(`[PUT /api/invitation] ${error as string}`)
    return unauthorized()
  }
}
