import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEventContext } from '@/lib/supabase/auth'
import { unauthorized, internalServerError } from '@/lib/api/errorHandling'
import Logger from '@/lib/api/logger'
import type { PlaceSuggestion } from '@/types/Trip'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const MIN_QUERY_LENGTH = 2
const LIMIT = 8
const THROTTLE_MS = 1100
const USER_AGENT = 'MazalTov/1.0 (wedding planning app)'

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
  country?: string
  country_code?: string
}

type NominatimItem = {
  place_id: number
  display_name: string
  address?: NominatimAddress
}

let lastNominatimAt = 0
let nominatimQueue: Promise<void> = Promise.resolve()

const waitForNominatimSlot = () => {
  const run = async () => {
    const wait = Math.max(0, THROTTLE_MS - (Date.now() - lastNominatimAt))
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait))
    lastNominatimAt = Date.now()
  }
  const next = nominatimQueue.then(run, run)
  nominatimQueue = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

const toSuggestion = (item: NominatimItem): PlaceSuggestion | null => {
  const countryCode = (item.address?.country_code ?? '').toLowerCase()
  const country = item.address?.country ?? ''
  const name =
    item.address?.city ||
    item.address?.town ||
    item.address?.village ||
    item.address?.municipality ||
    item.address?.state ||
    country ||
    item.display_name.split(',')[0]?.trim()
  if (!name) return null
  const label = country && country.toLocaleLowerCase() !== name.toLocaleLowerCase() ? `${name}, ${country}` : name
  return { id: String(item.place_id), name, country, countryCode, label }
}

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await getEventContext(supabase, request)
    if (!ctx) return unauthorized()

    const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
    const lang = request.nextUrl.searchParams.get('lang') === 'he' ? 'he' : 'en'
    if (q.length < MIN_QUERY_LENGTH) return NextResponse.json([] satisfies PlaceSuggestion[])

    await waitForNominatimSlot()

    const url = new URL(NOMINATIM_URL)
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', String(LIMIT))
    url.searchParams.set('accept-language', lang)

    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      next: { revalidate: 0 },
    })
    if (!response.ok) {
      Logger.error(`[GET /api/places/autocomplete] Nominatim ${response.status}`)
      return NextResponse.json([] satisfies PlaceSuggestion[])
    }

    const items = (await response.json()) as NominatimItem[]
    const seen = new Set<string>()
    const suggestions: PlaceSuggestion[] = []
    for (const item of items) {
      const suggestion = toSuggestion(item)
      if (!suggestion) continue
      const key = `${suggestion.name.toLocaleLowerCase()}|${suggestion.countryCode}`
      if (seen.has(key)) continue
      seen.add(key)
      suggestions.push(suggestion)
    }

    return NextResponse.json(suggestions)
  } catch (error) {
    Logger.error(`[GET /api/places/autocomplete] ${error as string}`)
    return internalServerError(error as string)
  }
}
