"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import AppHeader from "@/components/AppHeader";
import CustomButton from "@/components/Button/custom-button";
import SearchBar from "@/components/SearchBar";
import DeleteModal from "@/components/DeleteModal";
import ProvidersModal, { ProviderFormData } from "@/components/Providers/modal";
import ProviderCard from "@/components/Providers/provider-card";
import { useProvidersContext } from "@/context/ProvidersContext";
import type { Provider } from "@/types/Provider";
import { useAppContext } from "@/context/AppContext";

const Providers = () => {
  const { providers, addProvider, updateProvider, removeProvider } = useProvidersContext();
  const { rowDirectionClassName } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);

  const services = useMemo(
    () =>
      Array.from(
        new Set(
          providers
            .map((p) => p.service.trim())
            .filter((service) => !!service)
        )
      ),
    [providers]
  );

  const filteredProviders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return providers.filter((provider) => {
      const matchSearch =
        !query ||
        provider.name.toLowerCase().includes(query) ||
        provider.service.toLowerCase().includes(query) ||
        (provider.comments || "").toLowerCase().includes(query);

      const matchService = !selectedService || provider.service === selectedService;

      return matchSearch && matchService;
    });
  }, [providers, searchQuery, selectedService]);

  const handleOpenCreate = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProvider(null);
  };

  const handleSave = (data: ProviderFormData) => {
    if (editingProvider) {
      updateProvider(editingProvider.id, data);
    } else {
      addProvider(data);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (provider: Provider) => {
    setProviderToDelete(provider);
  };

  const handleConfirmDelete = () => {
    if (providerToDelete) {
      removeProvider(providerToDelete.id);
      setProviderToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setProviderToDelete(null);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex flex-row items-center justify-between">
        <AppHeader />
        <div className="flex flex-col gap-3 relative">
          <div className="flex flex-row items-center gap-3">
            <CustomButton onClick={handleOpenCreate}>הוסף ספק</CustomButton>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="חיפוש ספק" />
          </div>
          <div className={`absolute top-14 right-0 flex items-center gap-2 text-sm text-gray-700 ${rowDirectionClassName}`}>
            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
            <span>שירות</span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">הכל</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto mt-10">
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

      <ProvidersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        provider={editingProvider}
      />

      <DeleteModal
        isOpen={!!providerToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={providerToDelete?.name || ""}
      />
    </div>
  );
};

export default Providers;

