import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireEventContext } from '@/lib/supabase/auth'
import { internalServerError } from '@/lib/api/errorHandling'
import Logger from '@/lib/api/logger'
import type { PlaceSuggestion } from '@/types/Trip'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const MIN_QUERY_LENGTH = 2
const LIMIT = 8
const THROTTLE_MS = 1100
const USER_AGENT = 'MazalTov/1.0 (wedding planning app)'

type NominatimAddress = {
  house_number?: string
  road?: string
  city?: string
  town?: string
  village?: string
  municipality?: string
  state?: string
  country?: string
  country_code?: string
}

type NominatimItem = {
  place_id: number
  name?: string
  display_name: string
  namedetails?: Record<string, string>
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

const same = (a: string, b: string) => a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase()

const toSuggestion = (item: NominatimItem, lang: string): PlaceSuggestion | null => {
  const details = item.namedetails ?? {}
  const countryCode = (item.address?.country_code ?? '').toLowerCase()
  const country = item.address?.country ?? ''
  const city = item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || ''
  const street = [item.address?.house_number, item.address?.road].filter(Boolean).join(' ')
  const name = (details[`name:${lang}`] || item.name || details.name || street || city || country).trim()
  if (!name) return null
  const parts: string[] = []
  ;[name, city, country].forEach((part) => {
    if (part && !parts.some((existing) => same(existing, part))) parts.push(part)
  })
  return { id: String(item.place_id), name, country, countryCode, label: parts.join(', ') }
}

export const GET = async (request: NextRequest) => {
  try {
    const supabase = await createSupabaseServerClient()
    const ctx = await requireEventContext(supabase, request)
    if (ctx instanceof NextResponse) return ctx

    const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
    const lang = request.nextUrl.searchParams.get('lang') === 'he' ? 'he' : 'en'
    if (q.length < MIN_QUERY_LENGTH) return NextResponse.json([] satisfies PlaceSuggestion[])

    await waitForNominatimSlot()

    const url = new URL(NOMINATIM_URL)
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('namedetails', '1')
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
      const suggestion = toSuggestion(item, lang)
      if (!suggestion) continue
      const key = suggestion.label.toLocaleLowerCase()
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
