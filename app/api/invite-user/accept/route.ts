import { internalServerError, unauthorized } from '@/lib/api/errorHandling'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/api/logger'
import { EventMemberStatus } from '@/types/eventMember'

// Called after login. Links any pending invitations addressed to the caller's
// email to their user id and marks them active.
export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const accessToken = request.headers.get('X-Supabase-Auth')
    const { data: userData } = await supabase.auth.getUser(accessToken ?? '')
    const user = userData.user
    if (!user?.email) return unauthorized()

    const { data, error } = await supabase
      .from('event_members')
      .update({ user_id: user.id, status: EventMemberStatus.ACTIVE, updated_at: new Date().toISOString() })
      .ilike('email', user.email)
      .is('user_id', null)
      .select('id')

    if (error) {
      Logger.error(`[POST /api/invite-user/accept] ${error.message}`)
      return internalServerError(error.message)
    }

    Logger.info(`[POST /api/invite-user/accept] Linked ${data?.length ?? 0} invitation(s)`, user.id)
    return NextResponse.json({ accepted: data?.length ?? 0 })
  } catch (error) {
    Logger.error(`[POST /api/invite-user/accept] ${error as string}`)
    return internalServerError(error as string)
  }
}
