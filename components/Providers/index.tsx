'use client'

import { useMemo, useState } from 'react'
import AppHeader from '@/components/AppHeader'
import DeleteModal from '@/components/DeleteModal'
import ProvidersModal, { ProviderFormData } from '@/components/Providers/modal'
import ProviderCard from '@/components/Providers/provider-card'
import ProvidersHeader from '@/components/Providers/header'
import { useProvidersContext } from '@/context/ProvidersContext'
import type { Provider } from '@/types/Provider'
import { useAppContext } from '@/context/AppContext'

const Providers = () => {
  const { providers, addProvider, updateProvider, removeProvider } = useProvidersContext()
  const { rowDirectionClassName } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null)

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

      return matchSearch && matchService
    })
  }, [providers, searchQuery, selectedService])

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
  }

  return (
    <div className="flex w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex flex-row items-center justify-between">
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
        />
      </div>

      <div className="flex-1 mt-10">
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
                onEdit={handleOpenEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <ProvidersModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} provider={editingProvider} />

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
