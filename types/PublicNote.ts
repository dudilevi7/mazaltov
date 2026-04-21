import type { EventSettings } from '@/types/Settings'

interface PublicNote {
  id: string
  title: string
  content: object
  service: string
  eventDetails?: EventSettings
  updatedBy: string
  createdAt: number
  updatedAt: number
}

export type { PublicNote }
