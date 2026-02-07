'use client'

import type { Provider } from '@/types/Provider'
import type { Todo } from '@/types/Todo'
import { TodoStatus } from '@/types/Todo'
import CustomButton, { ButtonSize } from '@/components/Button/custom-button'
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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" dir={languageDirection}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">משימות ספק: {provider?.name || ''}</h2>
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
        <div className="mt-4 flex justify-end">
          <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
            סגור
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default ProviderTasksModal
