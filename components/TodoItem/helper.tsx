import { Todo } from '@/types/Todo'

export const buildGoogleCalendarUrl = (name: string, description: string, reminderTimestamp: number): string => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const title = encodeURIComponent(name)
  const details = description ? `&details=${encodeURIComponent(description)}` : ''

  let dateParam = ''
  if (reminderTimestamp > 0) {
    const d = new Date(reminderTimestamp)
    const formatGCal = (date: Date) =>
      date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '')
    const end = new Date(d.getTime() + 60 * 60 * 1000)
    dateParam = `&dates=${formatGCal(d)}/${formatGCal(end)}`
  }

  return `${baseUrl}&text=${title}${dateParam}${details}`
}
