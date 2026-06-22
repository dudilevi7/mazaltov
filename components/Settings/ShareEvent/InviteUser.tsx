'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import fetchData, { METHODS } from '@/lib/fetchData'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { type EventMember, EventRole } from '@/types/eventMember'
import CustomButton from '@/components/Button/custom-button'
import useSupabase from '@/hooks/useSupabase'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface InviteUserProps {
  onClose?: () => void
}

const InviteUser = ({ onClose }: InviteUserProps) => {
  const { languageDirection, currentRole, showToast, eventMembers, fetchEventMembers } = useAppContext()
  const isRtl = languageDirection === LanguageDirection.HEB
  const isAdmin = currentRole === EventRole.ADMIN
  const { user } = useSupabase()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<EventRole>(EventRole.EDITOR)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEventMembers()
  }, [])

  const emailValid = EMAIL_REGEX.test(email.trim())
  const canSubmit = isAdmin && emailValid && !isSubmitting

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      await fetchData<{ email: string; role: EventRole }, EventMember>({
        url: `${API_URL}${API_ROUTES.INVITE_USER}`,
        method: METHODS.POST,
        body: { email: email.trim().toLowerCase(), role },
      })
      setEmail('')
      setRole(EventRole.EDITOR)
      await fetchEventMembers(true)
      showToast({
        type: ToastType.SUCCESS,
        title: isRtl ? 'הזמנה נשלחה' : 'Invitation sent',
        message: isRtl ? 'המשתמש יקבל גישה כשיתחבר במייל זה' : 'The user gets access when they log in with this email',
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: isRtl ? 'שגיאה' : 'Error',
        message: isRtl ? 'ההזמנה נכשלה (אולי הגעת למגבלה)' : 'Invite failed (maybe the limit was reached)',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await fetchData({ url: `${API_URL}${API_ROUTES.INVITE_USER}?id=${id}`, method: METHODS.DELETE })
      await fetchEventMembers(true)
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: isRtl ? 'שגיאה' : 'Error',
        message: isRtl ? 'מחיקה נכשלה' : 'Remove failed',
      })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 font-sans" dir={languageDirection}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 self-start text-sm text-gray-600 transition hover:text-gray-900 cursor-pointer">
          <FontAwesomeIcon icon={faArrowRight} className={isRtl ? '' : 'rotate-180'} />
          {isRtl ? 'חזרה להגדרות' : 'Back to settings'}
        </button>
      )}

      <section className="rounded-lg bg-white p-5 shadow-sm border border-gray-100">
        <div className="mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faUserPlus} className="text-blue-500" />
          <h1 className="text-lg font-semibold text-gray-800">
            {isRtl ? 'שתף את האירוע למשתמש אחר' : 'Share event with another user'}
          </h1>
        </div>

        {!isAdmin ? (
          <p className="text-sm text-gray-500">
            {isRtl ? 'רק מנהל יכול לשתף את האירוע.' : 'Only an admin can share the event.'}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">{isRtl ? 'כתובת אימייל' : 'Email address'}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRtl ? 'הכנס אימייל' : 'Enter email'}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {email.length > 0 && !emailValid && (
                <span className="text-xs text-red-500">{isRtl ? 'אימייל לא תקין' : 'Invalid email'}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">{isRtl ? 'הרשאה' : 'Position'}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as EventRole)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                <option value="admin">{isRtl ? 'מנהל (יכול לשנות הכל)' : 'Admin (can change everything)'}</option>
                <option value="editor">
                  {isRtl ? 'עורך (הכל חוץ מפרטי האירוע)' : 'Editor (everything except event details)'}
                </option>
              </select>
            </div>

            <CustomButton
              className="justify-center"
              type="submit"
              disabled={!canSubmit}
              icon={<FontAwesomeIcon icon={faUserPlus} />}>
              {isRtl ? 'שלח הזמנה' : 'Send invitation'}
            </CustomButton>
          </form>
        )}
      </section>

      {eventMembers.length > 0 && (
        <section className="rounded-lg bg-white p-5 shadow-sm border border-gray-100">
          <h2 className="mb-3 text-base font-semibold text-gray-800">{isRtl ? 'משתתפים' : 'Members'}</h2>
          <ul className="flex flex-col gap-2">
            {eventMembers.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="truncate text-gray-700">{m.email}</span>
                <span className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                    {m.role === 'admin' ? (isRtl ? 'מנהל' : 'Admin') : isRtl ? 'עורך' : 'Editor'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {m.status === 'active' ? (isRtl ? 'פעיל' : 'Active') : isRtl ? 'ממתין' : 'Pending'}
                  </span>
                  {isAdmin && user?.id !== m.userId && (
                    <button
                      type="button"
                      onClick={() => handleRemove(m.id)}
                      className="text-gray-400 transition hover:text-red-500"
                      aria-label={isRtl ? 'הסר' : 'Remove'}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default InviteUser
