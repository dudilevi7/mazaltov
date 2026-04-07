'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faShareNodes, faEye, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { PUBLIC_NOTE_LABELS } from '@/constants/publicNotes'
import { API_URL } from '@/constants'
import { getSuggestedServiceByLabel } from '@/constants/providers'
import { formatDateDDMMYYHHMM } from '@/lib/dateUtils'
import Tooltip from '@/components/Tooltip'
import type { PublicNote } from '@/types/PublicNote'
import moment from 'moment'

interface PublicNoteItemProps {
  note: PublicNote
  onEdit: (note: PublicNote) => void
  onDelete: (note: PublicNote) => void
}

const PublicNoteItem = ({ note, onEdit, onDelete }: PublicNoteItemProps) => {
  const { languageDirection, showToast } = useAppContext()
  const isHeb = languageDirection === LanguageDirection.HEB
  const labels = isHeb ? PUBLIC_NOTE_LABELS.HEB : PUBLIC_NOTE_LABELS.ENG
  const suggestedService = getSuggestedServiceByLabel(note.service)
  const [expanded, setExpanded] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content && Object.keys(note.content).length > 0 ? note.content : undefined,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none text-sm text-gray-700',
        dir: isHeb ? 'rtl' : 'ltr',
      },
    },
  })

  const handleShare = async () => {
    const baseUrl = API_URL ?? window.location.origin
    const url = `${baseUrl}/publicnote?id=${note.id}`
    try {
      await navigator.clipboard.writeText(url)
      showToast({
        type: ToastType.SUCCESS,
        title: isHeb ? 'הצלחה' : 'Success',
        message: labels.linkCopied,
      })
    } catch {
      showToast({
        type: ToastType.ERROR,
        title: isHeb ? 'שגיאה' : 'Error',
        message: isHeb ? 'שגיאה בהעתקת הקישור' : 'Failed to copy link',
      })
    }
  }

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">{note.title}</span>
            {suggestedService && (
              <span className={`text-xs ${suggestedService.color}`}>
                <FontAwesomeIcon icon={suggestedService.icon} className="mr-1" />
                {note.service}
              </span>
            )}
            {!suggestedService && note.service && <span className="text-xs text-gray-500">{note.service}</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {note.updatedBy && <span>{note.updatedBy}</span>}
            <span>{moment(note.createdAt).format('DD.MM.YYYY')}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Tooltip content={labels.share}>
            <button
              onClick={handleShare}
              className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faShareNodes} className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <Tooltip content={labels.editNote}>
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <Tooltip content={expanded ? undefined : labels.watchNote}>
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${expanded ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}>
              <FontAwesomeIcon icon={expanded ? faChevronUp : faEye} className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <Tooltip content={labels.delete}>
            <button
              onClick={() => onDelete(note)}
              className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 px-4 py-3 animate-fade-in" dir={isHeb ? 'rtl' : 'ltr'}>
          <EditorContent editor={editor} />
          <div className="flex flex-col gap-0.5 mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
            <span>{formatDateDDMMYYHHMM(note.updatedAt ?? note.createdAt)}</span>
            {note.updatedBy && (
              <span>{isHeb ? `עודכן לאחרונה ע״י ${note.updatedBy}` : `Last updated by ${note.updatedBy}`}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicNoteItem
