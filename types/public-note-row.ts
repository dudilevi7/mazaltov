import type { PublicNote } from '@/types/PublicNote'

export type PublicNoteRow = {
  id: string
  user_id: string
  title: string
  content: object
  service: string
  updated_by: string
  created_at: string
  updated_at: string
}

export const mapPublicNoteRowToPublicNote = (row: PublicNoteRow): PublicNote => ({
  id: row.id,
  title: row.title ?? '',
  content: row.content ?? {},
  service: row.service ?? '',
  updatedBy: row.updated_by ?? '',
  createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
})

export const mapPublicNoteToPublicNoteRow = (
  note: Partial<PublicNote>
) => ({
  title: note.title ?? '',
  content: note.content ?? {},
  service: note.service ?? '',
  updated_by: note.updatedBy ?? '',
})
