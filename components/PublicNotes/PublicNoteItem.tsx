'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { ToastType } from '@/types/Toast'
import { PUBLIC_NOTE_LABELS } from '@/constants/publicNotes'
import { API_URL } from '@/constants'
import { getSuggestedServiceByLabel } from '@/constants/providers'
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
    <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{note.title}</span>
          {suggestedService && (
            <span className={`text-xs ${suggestedService.color}`}>
              <FontAwesomeIcon icon={suggestedService.icon} className="mr-1" />
              {note.service}
            </span>
          )}
          {!suggestedService && note.service && (
            <span className="text-xs text-gray-500">{note.service}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {note.updatedBy && <span>{note.updatedBy}</span>}
          <span>{moment(note.createdAt).format('DD.MM.YYYY')}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Tooltip content={labels.share}>
          <button onClick={handleShare} className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <FontAwesomeIcon icon={faShareNodes} className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
        <Tooltip content={labels.editNote}>
          <button onClick={() => onEdit(note)} className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
        <Tooltip content={labels.delete}>
          <button onClick={() => onDelete(note)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default PublicNoteItem
