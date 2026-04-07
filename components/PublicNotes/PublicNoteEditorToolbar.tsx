'use client'

import type { Editor } from '@tiptap/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faItalic,
  faStrikethrough,
  faListUl,
  faListOl,
  faHeading,
  faUndo,
  faRedo,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@/components/Tooltip'

interface ToolbarProps {
  editor: Editor | null
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon,
  title,
  tooltip,
}: {
  onClick: () => void
  isActive: boolean
  icon: typeof faBold
  title: string
  tooltip?: string
}) => (
  <Tooltip content={tooltip}>
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors cursor-pointer ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}>
      <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" />
    </button>
  </Tooltip>
)

const PublicNoteEditorToolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2 mb-2">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={faBold}
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={faUnderline}
        title="Underline"
        tooltip="Underline"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={faItalic}
        title="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={faStrikethrough}
        title="Strikethrough"
      />
      <div className="w-px bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={faHeading}
        title="Heading"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={faListUl}
        title="Bullet list"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={faListOl}
        title="Ordered list"
      />
      <div className="w-px bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        icon={faUndo}
        title="Undo"
        tooltip="Undo"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        icon={faRedo}
        title="Redo"
        tooltip="Redo"
      />
    </div>
  )
}

export default PublicNoteEditorToolbar
