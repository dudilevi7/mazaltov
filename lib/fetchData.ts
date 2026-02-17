import { supabase } from '@/lib/supabase/client'
import type { FetchDataOptions } from '@/types/General'

const getAuthToken = async (): Promise<string | null> => {
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
  const { url, method = METHODS.GET, body, headers = {}, cache, next } = options
  const token = await getAuthToken()

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    ...(cache !== undefined && { cache }),
    ...(next !== undefined && { next }),
  }
  if (body !== undefined && method !== METHODS.GET) {
    config.body = JSON.stringify(body)
  }

  const res = await fetch(url, config)
  if (!res.ok) {
    throw new Error(`fetchData failed: ${res.status} ${res.statusText}`)
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<TResponse>
  }
  return res.text() as Promise<TResponse>
}

export default fetchData
