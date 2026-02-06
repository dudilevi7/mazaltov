"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Provider } from "@/types/Provider";
import { getFromLocalStorage, setToLocalStorage } from "@/lib/utils";
import { MAZAL_TOV_PROVIDERS_KEY } from "@/constants/localStorage";

interface ProvidersContextType {
  providers: Provider[];
  setProviders: (providers: Provider[]) => void;
  addProvider: (provider: Omit<Provider, "id" | "createdAt" | "updatedAt">) => void;
  updateProvider: (id: number, provider: Partial<Omit<Provider, "id" | "createdAt">>) => void;
  removeProvider: (id: number) => void;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

const ProvidersProvider = ({ children }: { children: React.ReactNode }) => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    setProviders(getFromLocalStorage(MAZAL_TOV_PROVIDERS_KEY, []));
  }, []);

  const addProvider = (provider: Omit<Provider, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const newProvider: Provider = {
      ...provider,
      id: now,
      createdAt: now,
      updatedAt: now,
    };
    const nextProviders = [...providers, newProvider];
    setProviders(nextProviders);
    setToLocalStorage(MAZAL_TOV_PROVIDERS_KEY, nextProviders);
  };

  const updateProvider = (id: number, updates: Partial<Omit<Provider, "id" | "createdAt">>) => {
    const now = Date.now();
    const nextProviders = providers.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: now } : p
    );
    setProviders(nextProviders);
    setToLocalStorage(MAZAL_TOV_PROVIDERS_KEY, nextProviders);
  };

  const removeProvider = (id: number) => {
    const nextProviders = providers.filter((p) => p.id !== id);
    setProviders(nextProviders);
    setToLocalStorage(MAZAL_TOV_PROVIDERS_KEY, nextProviders);
  };

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        setProviders,
        addProvider,
        updateProvider,
        removeProvider,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
};

const useProvidersContext = (): ProvidersContextType => {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error("useProvidersContext must be used within ProvidersProvider");
  }
  return context;
};

export { ProvidersProvider, useProvidersContext };

