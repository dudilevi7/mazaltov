"use client";

import type { Provider } from "@/types/Provider";

interface ProviderCardHeaderProps {
  provider: Provider;
}

const ProviderCardHeader = ({ provider }: ProviderCardHeaderProps) => {
  const { name, service, toBePaid } = provider;

  return (
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        {!toBePaid && (
          <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded-md">שולם</span>
        )}
        <span className="text-lg font-semibold text-gray-800">{name}</span>
      </div>
      <span className="text-sm text-gray-500">{service}</span>
    </div>
  );
};

export default ProviderCardHeader;
