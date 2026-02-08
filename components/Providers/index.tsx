'use client'

import { useMemo, useState } from 'react'
import AppHeader from '@/components/AppHeader'
import DeleteModal from '@/components/DeleteModal'
import TodoModal, { TodoFormData } from '@/components/TodoModal'
import ProvidersModal, { ProviderFormData } from '@/components/Providers/modal'
import ProviderCard from '@/components/ProviderCard'
import ProviderTasksModal from '@/components/ProviderCard/ProviderTasksModal'
import ProvidersHeader from '@/components/Providers/header'
import { useProvidersContext } from '@/context/ProvidersContext'
import { useAppContext } from '@/context/AppContext'
import { PaidFilterStatus, Provider } from '@/types/Provider'
import { getIsPaid } from './helper'

const Providers = () => {
  const { providers, addProvider, updateProvider, removeProvider } = useProvidersContext()
  const { addTodo, todos, rowDirectionClassName } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [providerForTask, setProviderForTask] = useState<Provider | null>(null)
  const [providerForWatch, setProviderForWatch] = useState<Provider | null>(null)
  const [paidFilterValue, setPaidFilterValue] = useState<PaidFilterStatus>(PaidFilterStatus.ALL)

  const services = useMemo(
    () => Array.from(new Set(providers.map((p) => p.service.trim()).filter((service) => !!service))),
    [providers]
  )

  const filteredProviders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return providers.filter((provider) => {
      const matchSearch =
        !query ||
        provider.name.toLowerCase().includes(query) ||
        provider.service.toLowerCase().includes(query) ||
        (provider.comments || '').toLowerCase().includes(query)

      const matchService = !selectedService || provider.service === selectedService

      const matchPaidStatus = getIsPaid(provider, paidFilterValue)

      return matchSearch && matchService && matchPaidStatus
    })
  }, [providers, searchQuery, selectedService, paidFilterValue])

  const handleOpenCreate = () => {
    setEditingProvider(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProvider(null)
  }

  const handleSave = (data: ProviderFormData) => {
    if (editingProvider) {
      updateProvider(editingProvider.id, data)
    } else {
      addProvider(data)
    }
    handleCloseModal()
  }

  const handleDeleteClick = (provider: Provider) => {
    setProviderToDelete(provider)
  }

  const handleConfirmDelete = () => {
    if (providerToDelete) {
      removeProvider(providerToDelete.id)
      setProviderToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setProviderToDelete(null)
  }

  const handleClearAll = () => {
    setSearchQuery('')
    setSelectedService('')
    setPaidFilterValue(PaidFilterStatus.ALL)
  }

  const handleAddProviderTask = (provider: Provider) => {
    setProviderForTask(provider)
    setIsTaskModalOpen(true)
  }

  const handleTaskSave = (data: TodoFormData) => {
    addTodo({
      ...data,
      providerId: providerForTask?.id,
    })
    setIsTaskModalOpen(false)
    setProviderForTask(null)
  }

  const handleWatchProviderTasks = (provider: Provider) => {
    setProviderForWatch(provider)
  }

  const providerTasksMap = useMemo(() => {
    const map: Record<number, import('@/types/Todo').Todo[]> = {}
    todos.forEach((todo) => {
      if (todo.providerId != null) {
        if (!map[todo.providerId]) map[todo.providerId] = []
        map[todo.providerId].push(todo)
      }
    })
    return map
  }, [todos])

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 font-sans p-6">
      <div className="mb-6 flex shrink-0 flex-row items-center justify-between">
        <AppHeader />
        <ProvidersHeader
          onAddClick={handleOpenCreate}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          serviceValue={selectedService}
          onServiceChange={setSelectedService}
          serviceOptions={services}
          rowDirectionClassName={rowDirectionClassName}
          onClearAll={handleClearAll}
          paidFilterValue={paidFilterValue}
          onPaidFilterChange={setPaidFilterValue}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto mt-10">
        {filteredProviders.length === 0 ? (
          <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
            אין ספקים. הוסף ספק חדש כדי להתחיל.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                providerTasks={providerTasksMap[provider.id] || []}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteClick}
                onAddProviderTask={handleAddProviderTask}
                onWatchProviderTasks={handleWatchProviderTasks}
              />
            ))}
          </div>
        )}
      </div>

      <ProvidersModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} provider={editingProvider} />

      <TodoModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setProviderForTask(null)
        }}
        onSave={handleTaskSave}
        initialData={providerForTask ? { name: providerForTask.name, description: providerForTask.service } : undefined}
      />

      <ProviderTasksModal
        isOpen={!!providerForWatch}
        onClose={() => setProviderForWatch(null)}
        provider={providerForWatch}
        tasks={providerForWatch ? providerTasksMap[providerForWatch.id] || [] : []}
      />

      <DeleteModal
        isOpen={!!providerToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={providerToDelete?.name || ''}
      />
    </div>
  )
}

export default Providers
