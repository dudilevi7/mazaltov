import type { EventSettings } from '@/types/Settings'

export type EventRow = {
  id: string
  user_id: string
  event_id: string
  event_type: string
  custom_event_type: string | null
  owner_name: string | null
  bride_name: string | null
  groom_name: string | null
  bride_phone: string | null
  groom_phone: string | null
  owner_phone: string | null
  event_hall: string | null
  event_date: string | null
  created_at?: string
  updated_at?: string
}

export const mapSupabaseEventRowToEventSettings = (row: EventRow): EventSettings => ({
  eventId: row.event_id ?? '',
  eventType: (row.event_type as EventSettings['eventType']) ?? 'wedding',
  customEventType: row.custom_event_type ?? undefined,
  ownerName: row.owner_name ?? undefined,
  brideName: row.bride_name ?? undefined,
  groomName: row.groom_name ?? undefined,
  bridePhone: row.bride_phone ?? undefined,
  groomPhone: row.groom_phone ?? undefined,
  ownerPhone: row.owner_phone ?? undefined,
  eventHall: row.event_hall ?? undefined,
  eventDate: row.event_date ?? undefined,
})

export const mapEventSettingsToSupabaseEventRow = (settings: Partial<EventSettings>) => ({
  event_id: settings.eventId ?? null,
  event_type: settings.eventType ?? null,
  custom_event_type: settings.customEventType ?? null,
  owner_name: settings.ownerName ?? null,
  bride_name: settings.brideName ?? null,
  groom_name: settings.groomName ?? null,
  bride_phone: settings.bridePhone ?? null,
  groom_phone: settings.groomPhone ?? null,
  owner_phone: settings.ownerPhone ?? null,
  event_hall: settings.eventHall ?? null,
  event_date: settings.eventDate ?? null,
})
