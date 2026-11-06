'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { MarketingCopy } from '@/constants/marketing'
import { buildContactMailto, LOGIN_PATH, PRIMARY_CTA_CLASS, validateContact, type ContactFields } from './helper'

interface ConnectProps {
  copy: MarketingCopy
}

const FIELD_CLASS =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-start text-gray-900 outline-none transition focus:border-blue-500'

const EMPTY_FIELDS: ContactFields = { name: '', email: '', eventId: '', message: '' }

const Connect = ({ copy }: ConnectProps) => {
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFields, string>>>({})

  const setField = (key: keyof ContactFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateContact(fields, copy.connect.errors)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const eventLabel = copy.events.find((item) => item.id === fields.eventId)?.label ?? ''
    window.location.href = buildContactMailto({
      name: fields.name,
      email: fields.email,
      eventLabel,
      message: fields.message,
      subject: copy.connect.subject,
    })
  }

  return (
    <section id="connect" className="scroll-mt-28 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-blue-600">{copy.connect.kicker}</p>
          <h2 className="mt-3 text-3xl font-semibold leading-snug text-balance sm:text-4xl">{copy.connect.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{copy.connect.body}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/70">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              {copy.connect.name}
              <input
                className={`${FIELD_CLASS} mt-1.5`}
                value={fields.name}
                onChange={(event) => setField('name', event.target.value)}
                autoComplete="name"
              />
              {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
            </label>
            <label className="block text-sm font-medium">
              {copy.connect.email}
              <input
                className={`${FIELD_CLASS} mt-1.5`}
                type="email"
                value={fields.email}
                onChange={(event) => setField('email', event.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium">
            {copy.connect.event}
            <select
              className={`${FIELD_CLASS} mt-1.5`}
              value={fields.eventId}
              onChange={(event) => setField('eventId', event.target.value)}>
              <option value="">{copy.connect.eventPlaceholder}</option>
              {copy.events.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.eventId && <span className="mt-1 block text-xs text-red-600">{errors.eventId}</span>}
          </label>
          <label className="mt-4 block text-sm font-medium">
            {copy.connect.message}
            <textarea
              className={`${FIELD_CLASS} mt-1.5 min-h-28 resize-y`}
              value={fields.message}
              onChange={(event) => setField('message', event.target.value)}
            />
            {errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message}</span>}
          </label>
          <button type="submit" className={`${PRIMARY_CTA_CLASS} mt-5 w-full sm:w-auto`}>
            {copy.connect.send}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            {copy.connect.or}{' '}
            <Link href={LOGIN_PATH} className="font-medium text-blue-600 hover:text-blue-700">
              {copy.connect.start}
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Connect
