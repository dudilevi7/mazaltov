'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/context/AppContext'
import { usePublicNotesContext } from '@/context/PublicNotesContext'
import { LanguageDirection } from '@/types/General'
import { PUBLIC_NOTE_LABELS } from '@/constants/publicNotes'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import DeleteModal from '@/components/DeleteModal'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import PublicNoteItem from './PublicNoteItem'
import PublicNoteEditor from './PublicNoteEditor'
import type { PublicNote } from '@/types/PublicNote'

interface PublicNotesModalProps {
  isOpen: boolean
  onClose: () => void
}

const PublicNotesModal = ({ isOpen, onClose }: PublicNotesModalProps) => {
  const { languageDirection } = useAppContext()
  const { publicNotes, addPublicNote, updatePublicNote, removePublicNote, isLoadingPublicNotes } =
    usePublicNotesContext()
  const isHeb = languageDirection === LanguageDirection.HEB
  const labels = isHeb ? PUBLIC_NOTE_LABELS.HEB : PUBLIC_NOTE_LABELS.ENG

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<PublicNote | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PublicNote | null>(null)

  if (!isOpen) return null

  const handleAdd = () => {
    setEditingNote(null)
    setEditorOpen(true)
  }

  const handleEdit = (note: PublicNote) => {
    setEditingNote(note)
    setEditorOpen(true)
  }

  const handleSave = async (data: { title: string; content: object; service: string; updatedBy: string }) => {
    if (editingNote) {
      await updatePublicNote(editingNote.id, data)
    } else {
      await addPublicNote(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    await removePublicNote(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
        <div
          className="w-full max-w-2xl rounded-lg bg-white shadow-xl animate-fade-in max-h-[85vh] flex flex-col"
          dir={languageDirection}>
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
            <div className="flex items-center gap-2">
              <CustomButton size={ButtonSize.SM} onClick={handleAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
                {labels.addNote}
              </CustomButton>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl ms-2">
                &times;
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingPublicNotes ? (
              <div className="flex justify-center py-8">
                <SpinnerLoader size="md" />
              </div>
            ) : publicNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <span className="text-sm">{labels.noNotes}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {publicNotes.map((note) => (
                  <PublicNoteItem key={note.id} note={note} onEdit={handleEdit} onDelete={setDeleteTarget} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editorOpen && (
        <PublicNoteEditor
          isOpen={editorOpen}
          onClose={() => {
            setEditorOpen(false)
            setEditingNote(null)
          }}
          onSave={handleSave}
          isEditMode={!!editingNote}
          note={editingNote}
        />
      )}

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteTarget?.title ?? ''}
      />
    </>
  )
}

export default PublicNotesModal
