'use client'

import { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartColumn, faChartPie, faCoins, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { LanguageDirection } from '@/types/General'
import { TripCurrency, type Trip } from '@/types/Trip'
import { COST_TYPE_META } from '@/constants/tripCostTypes'
import { CURRENCY_OPTIONS, TRIP_SECTION_META, getTripCopy } from '@/constants/trips'
import { formatTripCost, hasAnyCost, locationKey } from './helper'
import { collectTripLocations, computeTripTotals } from './tripLocations'
import PlaceFlag from './PlaceFlag'
import {
  COUNTRY_BAR_COLORS,
  EXPENSE_COLORS,
  costsByCategory,
  costsByCountry,
  currenciesInTotals,
  type ExpenseKey,
} from './tripStats'

interface TripStatisticsProps {
  trip: Trip
  isRtl: boolean
}

const CURRENCY_ORDER: TripCurrency[] = [TripCurrency.ILS, TripCurrency.USD, TripCurrency.EUR]

const expenseLabel = (key: ExpenseKey, isRtl: boolean): string => {
  if (key === 'flights' || key === 'hotels' || key === 'attractions') {
    const meta = TRIP_SECTION_META[key]
    return isRtl ? meta.he : meta.en
  }
  const meta = COST_TYPE_META[key]
  return isRtl ? meta.he : meta.en
}

const currencyLabel = (currency: TripCurrency): string =>
  CURRENCY_OPTIONS.find((option) => option.value === currency)?.label ?? currency

interface PieTooltipItem {
  name?: string
  value?: number
  payload?: { fill?: string }
}

const ExpenseTooltip = ({
  active,
  payload,
  currency,
}: {
  active?: boolean
  payload?: ReadonlyArray<PieTooltipItem>
  currency: TripCurrency
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-800 shadow-sm">
      <p className="font-semibold text-gray-900">{item.name}</p>
      <p className="text-gray-600">{formatTripCost(item.value ?? 0, currency)}</p>
    </div>
  )
}

interface ExpensePieProps {
  slices: { key: ExpenseKey; amount: number; label: string }[]
  currency: TripCurrency
  title: string
  emptyLabel: string
}

const ExpensePie = ({ slices, currency, title, emptyLabel }: ExpensePieProps) => {
  const [activeKey, setActiveKey] = useState<ExpenseKey | null>(null)
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0)
  const visible = activeKey ? slices.filter((slice) => slice.key === activeKey) : slices

  if (total === 0) {
    return <p className="py-6 text-center text-sm text-gray-400">{emptyLabel}</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <FontAwesomeIcon icon={faChartPie} className="text-fuchsia-500" />
        {title}
      </h3>
      <div className="flex flex-row items-center gap-4">
        <div className="h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visible}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={38}
                paddingAngle={2}
                animationDuration={400}>
                {visible.map((slice) => (
                  <Cell key={slice.key} fill={EXPENSE_COLORS[slice.key]} />
                ))}
              </Pie>
              <Tooltip content={<ExpenseTooltip currency={currency} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {slices.map((slice) => {
            const percent = ((slice.amount / total) * 100).toFixed(1)
            const isActive = activeKey === slice.key
            const isDimmed = activeKey !== null && !isActive
            return (
              <button
                key={slice.key}
                type="button"
                onClick={() => setActiveKey((current) => (current === slice.key ? null : slice.key))}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-start text-xs transition-all hover:bg-gray-50 ${
                  isActive ? 'bg-gray-100 ring-1 ring-gray-300' : ''
                } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: EXPENSE_COLORS[slice.key] }}
                />
                <span className="truncate font-medium text-gray-700">{slice.label}</span>
                <span className="ms-auto whitespace-nowrap text-gray-400">
                  {formatTripCost(slice.amount, currency)} ({percent}%)
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const TripStatistics = ({ trip, isRtl }: TripStatisticsProps) => {
  const copy = getTripCopy(isRtl)
  const locale = isRtl ? 'he' : 'en'
  const locations = useMemo(() => collectTripLocations(trip, locale), [trip, locale])
  const totals = useMemo(() => computeTripTotals(trip), [trip])
  const currencies = useMemo(() => currenciesInTotals(totals), [totals])
  const [currency, setCurrency] = useState<TripCurrency>(currencies[0] ?? TripCurrency.ILS)

  useEffect(() => {
    if (!currencies.includes(currency)) setCurrency(currencies[0] ?? TripCurrency.ILS)
  }, [currencies, currency])

  const countryBars = useMemo(
    () => costsByCountry(trip, currency, locale, copy.unknownCountry),
    [trip, currency, locale, copy.unknownCountry]
  )
  const categorySlices = useMemo(() => {
    return costsByCategory(trip, currency).map((slice) => ({
      ...slice,
      label: expenseLabel(slice.key, isRtl),
    }))
  }, [trip, currency, isRtl])
  const maxCountry = countryBars.reduce((max, bar) => Math.max(max, bar.amount), 0)

  return (
    <div className="flex flex-col gap-6" dir={isRtl ? LanguageDirection.HEB : LanguageDirection.ENG}>
      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FontAwesomeIcon icon={faLocationDot} className="text-sky-500" />
          {copy.locationsTitle}
          {locations.length > 0 && <span className="font-normal text-gray-400">({locations.length})</span>}
        </h3>
        {locations.length === 0 ? (
          <p className="text-sm text-gray-400">{copy.noLocations}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <li
                key={locationKey(location.name)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                <PlaceFlag countryCode={location.countryCode} />
                {location.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-gray-200" />

      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FontAwesomeIcon icon={faCoins} className="text-amber-500" />
          {copy.totalCost}
        </h3>
        {hasAnyCost(totals) ? (
          <div className="flex flex-wrap gap-2">
            {CURRENCY_ORDER.map((item) =>
              totals[item] ? (
                <span key={item} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {formatTripCost(totals[item], item)}
                </span>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">{copy.noCostData}</p>
        )}
      </section>

      {currencies.length > 0 && (
        <>
          <div className="border-t border-gray-200" />
          {currencies.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500">{copy.chartCurrency}</span>
              {currencies.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCurrency(item)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
                    item === currency ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {currencyLabel(item)}
                </button>
              ))}
            </div>
          )}

          <section className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FontAwesomeIcon icon={faChartColumn} className="text-indigo-500" />
              {copy.costsByCountry}
              <span className="font-normal text-gray-400">{currency}</span>
            </h3>
            {countryBars.length === 0 ? (
              <p className="text-sm text-gray-400">{copy.noCostData}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {countryBars.map((bar, index) => (
                  <li key={bar.id}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-medium text-gray-700">
                        <PlaceFlag countryCode={bar.code} />
                        <span className="truncate">{bar.label}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-gray-600">
                        {formatTripCost(bar.amount, currency)}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${Math.max(4, (bar.amount / maxCountry) * 100)}%`,
                          backgroundColor: COUNTRY_BAR_COLORS[index % COUNTRY_BAR_COLORS.length],
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-gray-500">{copy.totalsExcludeFlights}</p>
          </section>

          <div className="border-t border-gray-200" />

          <ExpensePie
            slices={categorySlices}
            currency={currency}
            title={copy.costsByCategory}
            emptyLabel={copy.noCostData}
          />
        </>
      )}
    </div>
  )
}

export default TripStatistics
