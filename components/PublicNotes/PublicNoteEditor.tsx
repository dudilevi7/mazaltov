'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useAppContext } from '@/context/AppContext'
import { LanguageDirection } from '@/types/General'
import { SUGGESTED_SERVICES_OPTIONS } from '@/constants/providers'
import { PUBLIC_NOTE_LABELS } from '@/constants/publicNotes'
import SelectDropdown from '@/components/Shared/SelectDropdown'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import PublicNoteEditorToolbar from './PublicNoteEditorToolbar'
import type { PublicNote } from '@/types/PublicNote'

interface PublicNoteEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: { title: string; content: object; service: string; updatedBy: string }) => void
  note?: PublicNote | null
  isEditMode: boolean
}

const PublicNoteEditor = ({ isOpen, onClose, onSave, note, isEditMode }: PublicNoteEditorProps) => {
  const { languageDirection } = useAppContext()
  const isHeb = languageDirection === LanguageDirection.HEB
  const labels = isHeb ? PUBLIC_NOTE_LABELS.HEB : PUBLIC_NOTE_LABELS.ENG

  const [title, setTitle] = useState('')
  const [service, setService] = useState('')
  const [updatedBy, setUpdatedBy] = useState('')

  useEffect(() => {
    if (isEditMode) {
      setTitle(note?.title ?? '')
      setService(note?.service ?? '')
      setUpdatedBy(note?.updatedBy ?? '')
    }
  }, [isEditMode, note])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Placeholder.configure({ placeholder: isHeb ? 'כתוב כאן...' : 'Write here...' })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-gray-900',
        dir: languageDirection,
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (isEditMode && note?.content && Object.keys(note.content).length > 0) {
      editor.commands.setContent(note.content)
    } else if (!isEditMode) {
      editor.commands.setContent('')
    }
  }, [editor, note, isEditMode])

  if (!isOpen) return null

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      content: editor?.getJSON() ?? {},
      service,
      updatedBy: updatedBy.trim(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="w-full max-w-lg rounded-lg bg-white shadow-xl animate-fade-in max-h-[90vh] overflow-y-auto"
        dir={languageDirection}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{isEditMode ? labels.editNote : labels.addNote}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl">
            &times;
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.noteTitle}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              dir={languageDirection}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.service}</label>
            <SelectDropdown
              value={service}
              onChange={setService}
              options={SUGGESTED_SERVICES_OPTIONS}
              placeholder={isHeb ? 'בחר שירות' : 'Select service'}
              searchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.updatedBy}</label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              placeholder={isHeb ? 'שם האחראי' : 'Responsible person'}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              dir={languageDirection}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.noteContent}</label>
            <div className="rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <PublicNoteEditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end border-t border-gray-200 p-4">
          <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
            {labels.cancel}
          </CustomButton>
          <CustomButton size={ButtonSize.SM} onClick={handleSave} disabled={!title.trim()}>
            {labels.save}
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default PublicNoteEditor
