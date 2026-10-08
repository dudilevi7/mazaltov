import { supabase } from '@/lib/supabase/client'
import type { FetchDataOptions } from '@/types/General'
import { MAZAL_TOV_ACTIVE_EVENT_KEY } from '@/constants/localStorage'
import { NO_EVENT_ERROR_CODE, NO_EVENT_EVENT_NAME } from '@/constants/eventSetup'

export class FetchDataError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export const getActiveEventId = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(MAZAL_TOV_ACTIVE_EVENT_KEY)
}

export const getAuthToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const fetchData = async <TBody = unknown, TResponse = unknown>(
  options: FetchDataOptions<TBody>
): Promise<TResponse> => {
  const { url, method = METHODS.GET, body, headers = {}, cache, next, signal } = options
  const token = await getAuthToken()

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }
  if (token) {
    requestHeaders['X-Supabase-Auth'] = token
  }
  const activeEventId = getActiveEventId()
  if (activeEventId) {
    requestHeaders['X-Event-Id'] = activeEventId
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    ...(cache !== undefined && { cache }),
    ...(next !== undefined && { next }),
    ...(signal !== undefined && { signal }),
  }
  if (body !== undefined && method !== METHODS.GET) {
    config.body = JSON.stringify(body)
  }

  const res = await fetch(url, config)
  if (!res.ok) {
    const payload = await res.json().catch(() => null)
    const code = typeof payload?.error === 'string' ? payload.error : undefined
    if (code === NO_EVENT_ERROR_CODE && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(NO_EVENT_EVENT_NAME))
    }
    throw new FetchDataError(payload?.message ?? `fetchData failed: ${res.status} ${res.statusText}`, res.status, code)
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<TResponse>
  }
  return res.text() as Promise<TResponse>
}

export default fetchData
