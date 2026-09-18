'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import type { PlaceSuggestion } from '@/types/Trip'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import fetchData, { METHODS } from '@/lib/fetchData'
import { getTripCopy } from '@/constants/trips'
import { INPUT_CLASS, locationKey } from './helper'
import PlaceFlag from './PlaceFlag'

const MIN_CHARS = 2
const DEBOUNCE_MS = 300
const cache = new Map<string, PlaceSuggestion[]>()

export interface LocationChange {
  name: string
  country?: string
  countryCode?: string
}

interface LocationAutocompleteProps {
  value: string
  countryCode?: string
  onChange: (next: LocationChange) => void
  placeholder?: string
  existingPlaces?: PlaceSuggestion[]
  disabled?: boolean
  required?: boolean
  className?: string
}

const toExistingSuggestion = (place: PlaceSuggestion): PlaceSuggestion => ({
  ...place,
  id: place.id || `local-${locationKey(place.name)}`,
  label: place.label || (place.country && place.country !== place.name ? `${place.name}, ${place.country}` : place.name),
})

const LocationAutocomplete = ({
  value,
  countryCode,
  onChange,
  placeholder,
  existingPlaces = [],
  disabled = false,
  required = false,
  className = '',
}: LocationAutocompleteProps) => {
  const { languageDirection } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const copy = getTripCopy(isRtl)
  const [query, setQuery] = useState(value)
  const [remote, setRemote] = useState<PlaceSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<PlaceSuggestion | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const q = query.trim()
    if (q.length < MIN_CHARS) {
      setRemote([])
      setLoading(false)
      return
    }

    const lang = isRtl ? 'he' : 'en'
    const cacheKey = `${lang}:${q.toLocaleLowerCase()}`
    const cached = cache.get(cacheKey)
    if (cached) {
      setRemote(cached)
      setLoading(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      try {
        const results = await fetchData<unknown, PlaceSuggestion[]>({
          url: `${API_URL}${API_ROUTES.PLACES_AUTOCOMPLETE}?q=${encodeURIComponent(q)}&lang=${lang}`,
          method: METHODS.GET,
          signal: controller.signal,
        })
        const next = Array.isArray(results) ? results : []
        cache.set(cacheKey, next)
        setRemote(next)
      } catch (error) {
        const aborted = error instanceof DOMException ? error.name === 'AbortError' : (error as Error).name === 'AbortError'
        if (!aborted) setRemote([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      abortRef.current?.abort()
    }
  }, [query, isRtl])

  const options = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    const local = existingPlaces
      .map(toExistingSuggestion)
      .filter((place) => !q || place.name.toLocaleLowerCase().includes(q) || place.label.toLocaleLowerCase().includes(q))
    const remoteOnly = remote.filter(
      (place) => !local.some((item) => locationKey(item.name) === locationKey(place.name) && item.countryCode === place.countryCode)
    )
    return [...local, ...remoteOnly]
  }, [existingPlaces, query, remote])

  const handleSelect = (place: PlaceSuggestion | null) => {
    if (!place) return
    setSelected(place)
    onChange({ name: place.name, country: place.country, countryCode: place.countryCode })
    setQuery(place.name)
  }

  const showOptions = !disabled && (loading || options.length > 0 || query.trim().length >= MIN_CHARS)

  return (
    <Combobox value={selected} onChange={handleSelect} disabled={disabled} immediate by="id">
      <div className={`relative ${className}`} dir={languageDirection}>
        <div className="relative">
          {countryCode ? (
            <PlaceFlag countryCode={countryCode} className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2" />
          ) : null}
          <ComboboxInput
            autoComplete="off"
            disabled={disabled}
            required={required}
            displayValue={() => query}
            onChange={(e) => {
              const next = e.target.value
              setSelected(null)
              setQuery(next)
              onChange({ name: next, countryCode: next.trim() === value.trim() ? countryCode : '' })
            }}
            placeholder={placeholder ?? copy.locationPlaceholder}
            className={`${INPUT_CLASS} ${countryCode ? 'ps-8' : ''} ${disabled ? 'bg-gray-100 text-gray-900' : ''}`}
          />
        </div>
        {showOptions && (
          <ComboboxOptions
            anchor="bottom start"
            className="z-50 max-h-60 w-(--input-width) [--anchor-gap:4px] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 empty:invisible">
            {loading && options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">{copy.searchingLocations}</div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">{copy.noLocationResults}</div>
            ) : (
              options.map((place) => (
                <ComboboxOption
                  key={place.id}
                  value={place}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-gray-900 select-none data-focus:bg-blue-100">
                  <PlaceFlag countryCode={place.countryCode} />
                  <span className="truncate">{place.label}</span>
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}

export default LocationAutocomplete
