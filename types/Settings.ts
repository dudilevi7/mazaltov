enum EventType {
  WEDDING = 'wedding',
  BAR_MITZVA = 'bar_mitzva',
  BRIT = 'brit',
  CUSTOM = 'custom',
}

interface EventSettings {
  eventType: EventType
  customEventType?: string
  ownerName?: string
  brideName?: string
  groomName?: string
}

export { EventType }
export type { EventSettings }

