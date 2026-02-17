enum EventType {
  WEDDING = 'wedding',
  BAR_MITZVA = 'bar_mitzva',
  BRIT = 'brit',
  CUSTOM = 'custom',
}

interface EventSettings {
  eventId: string
  eventType: EventType
  customEventType?: string
  ownerName?: string
  brideName?: string
  groomName?: string
  bridePhone?: string
  groomPhone?: string
  ownerPhone?: string
  eventHall?: string
  eventDate?: string
}

export { EventType }
export type { EventSettings }

