'use client'

import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import ActionButton, { ActionButtonSize, ActionButtonVariant } from '@/components/Button/action-button'

interface TripItemActionsProps {
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}

const TripItemActions = ({ onEdit, onDelete, editLabel, deleteLabel }: TripItemActionsProps) => (
  <div className="flex shrink-0 items-center gap-0.5">
    <ActionButton
      icon={faPen}
      variant={ActionButtonVariant.EDIT}
      size={ActionButtonSize.SM}
      tooltip={editLabel}
      onClick={onEdit}
    />
    <ActionButton
      icon={faTrash}
      variant={ActionButtonVariant.DELETE}
      size={ActionButtonSize.SM}
      tooltip={deleteLabel}
      onClick={onDelete}
    />
  </div>
)

export default TripItemActions
