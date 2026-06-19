export enum EventRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
}
export enum EventMemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}

export interface EventMemberRow {
  id: string
  event_id: string
  user_id: string | null
  email: string
  role: EventRole
  status: EventMemberStatus
  invited_by: string | null
  created_at?: string
  updated_at?: string
}

export interface EventMember {
  id: string
  eventId: string
  userId: string | null
  email: string
  role: EventRole
  status: EventMemberStatus
  invitedBy: string | null
}

export interface AccessibleEvent {
  eventId: string
  role: EventRole
  isOwner: boolean
  eventType: string | null
  ownerName: string | null
  brideName: string | null
  groomName: string | null
}

export const mapEventMemberRowToEventMember = (row: EventMemberRow): EventMember => ({
  id: row.id,
  eventId: row.event_id,
  userId: row.user_id,
  email: row.email,
  role: row.role,
  status: row.status,
  invitedBy: row.invited_by,
})
