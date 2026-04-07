'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { API_URL } from '@/constants'
import { API_ROUTES } from '@/constants/apiRoutes'
import { getSuggestedServiceByLabel } from '@/constants/providers'
import PublicNoteEditorToolbar from '@/components/PublicNotes/PublicNoteEditorToolbar'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import type { PublicNote } from '@/types/PublicNote'
import fetchData, { METHODS } from '@/lib/fetchData'
import Logo from '@/components/AppHeader/Logo'
import { formatDateDDMMYYHHMM } from '@/lib/dateUtils'

const PublicNotePageContent = () => {
  const searchParams = useSearchParams()
  const noteId = searchParams.get('id')

  const [note, setNote] = useState<PublicNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [updatedBy, setUpdatedBy] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'כתוב כאן...' })],
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[200px] px-4 py-3 text-sm text-gray-900',
        dir: 'rtl',
      },
    },
  })

  useEffect(() => {
    if (!noteId) {
      setError('Missing note ID')
      setLoading(false)
      return
    }
    const fetchNote = async () => {
      try {
        const baseUrl = API_URL ?? window.location.origin
        const res = await fetch(`${baseUrl}${API_ROUTES.PUBLIC_NOTES}/${noteId}`)
        if (!res.ok) {
          setError(res.status === 404 ? 'הערה לא נמצאה' : 'שגיאה בטעינת ההערה')
          return
        }
        const data = await fetchData<unknown, PublicNote>({
          url: `${baseUrl}${API_ROUTES.PUBLIC_NOTES}/${noteId}`,
          method: METHODS.GET,
        })
        setNote(data)
        setUpdatedBy(data.updatedBy ?? '')
      } catch {
        setError('שגיאה בטעינת ההערה')
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [noteId])

  useEffect(() => {
    if (editor && note?.content && Object.keys(note.content).length > 0) {
      editor.commands.setContent(note.content)
    }
  }, [editor, note])

  const handleSave = useCallback(async () => {
    if (!noteId || !editor) return
    setSaving(true)
    setSaved(false)
    const body: Partial<PublicNote> = {
      ...note,
      content: editor.getJSON(),
      updatedBy: updatedBy.trim(),
    }
    try {
      const baseUrl = API_URL ?? window.location.origin
      const res = await fetchData<Partial<PublicNote>, PublicNote>({
        url: `${baseUrl}${API_ROUTES.PUBLIC_NOTES}/${noteId}`,
        method: METHODS.PUT,
        body,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('שגיאה בשמירת ההערה')
    } finally {
      setSaving(false)
    }
  }, [noteId, editor, updatedBy])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <SpinnerLoader size="lg" />
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FontAwesomeIcon icon={faNoteSticky} className="text-gray-300 text-4xl mb-3" />
          <p className="text-gray-500">{error ?? 'הערה לא נמצאה'}</p>
        </div>
      </div>
    )
  }

  const suggestedService = getSuggestedServiceByLabel(note.service)

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full" dir="rtl">
      <Logo className="mt-4" />
      <div className="max-w-2xl mx-auto px-4 h-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faNoteSticky} className="text-blue-500" />
                <h1 className="text-lg font-semibold text-gray-900">{note.title}</h1>
              </div>
              {suggestedService && (
                <span className={`text-sm ${suggestedService.color} flex items-center gap-1`}>
                  <FontAwesomeIcon icon={suggestedService.icon} />
                  {note.service}
                </span>
              )}
            </div>
            <div className="flex flex-row gap-1 absolute bottom-1 left-2">
              <span className="text-xs text-gray-500">עודכן לאחרונה</span>
              <span className="text-xs text-gray-500">{formatDateDDMMYYHHMM(note.updatedAt ?? note.createdAt)}</span>
            </div>
          </div>

          <div className="px-4 pt-3">
            <PublicNoteEditorToolbar editor={editor} />
          </div>

          <EditorContent editor={editor} />

          <div className="border-t border-gray-200 p-4 flex items-center justify-between gap-3">
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              placeholder="השם שלך"
              className="rounded-md bg-linear-to-r from-gray-50 to-gray-100 border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              dir="rtl"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 rounded-md ${saved ? 'bg-green-500' : 'bg-blue-500'} px-4 py-1.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50 cursor-pointer transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {saving ? 'שומר...' : saved ? 'נשמר!' : 'שמור'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PublicNotePage = () => (
  <Suspense fallback={<SpinnerLoader size="lg" />}>
    <PublicNotePageContent />
  </Suspense>
)

export default PublicNotePage
