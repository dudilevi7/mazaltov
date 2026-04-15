'use client'

import type { Provider } from '@/types/Provider'
import type { Todo } from '@/types/Todo'
import { TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
import Modal from '@/components/Shared/Modal'
import { useAppContext } from '@/context/AppContext'

const STATUS_LABEL: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'ממתין',
  [TodoStatus.IN_PROGRESS]: 'בתהליך',
  [TodoStatus.COMPLETED]: 'הושלם',
}

interface ProviderTasksModalProps {
  isOpen: boolean
  onClose: () => void
  provider: Provider | null
  tasks: Todo[]
}

const ProviderTasksModal = ({ isOpen, onClose, provider, tasks }: ProviderTasksModalProps) => {
  const { languageDirection } = useAppContext()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={`משימות ספק: ${provider?.name || ''}`}
      actions={
        <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
          סגור
        </CustomButton>
      }>
      <div className="p-6" dir={languageDirection}>
        <div className="flex flex-col gap-2 max-h-64 overflow-auto">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500">אין משימות</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
                <span className="font-medium text-gray-900">{task.name}</span>
                <span className="text-sm text-gray-600">{STATUS_LABEL[task.status]}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ProviderTasksModal
