'use client'

import { useEffect, useState, useCallback } from 'react'
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

const PublicNotePage = () => {
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
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-gray-900',
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
        const data: PublicNote = await res.json()
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
    try {
      const baseUrl = API_URL ?? window.location.origin
      const res = await fetch(`${baseUrl}${API_ROUTES.PUBLIC_NOTES}/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editor.getJSON(),
          updatedBy: updatedBy.trim(),
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      // silent fail on public page
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py- h-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-4">
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
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              dir="rtl"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-1.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50 cursor-pointer transition-colors">
              <FontAwesomeIcon icon={faFloppyDisk} />
              {saving ? 'שומר...' : saved ? 'נשמר!' : 'שמור'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicNotePage
