"use client";

import { useAppContext } from "@/context/AppContext";
import type { Provider } from "@/types/Provider";
import type { Todo } from "@/types/Todo";
import ProviderCardHeader from "./header";
import ProviderCardContent from "./content";
import ProviderCardFooter from "./footer";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cash: "מזומן",
  transfer: "העברה",
  check: "צ׳ק",
  other: "אחר",
};

interface ProviderCardProps {
  provider: Provider;
  providerTasks: Todo[];
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
  onAddProviderTask: (provider: Provider) => void;
  onWatchProviderTasks: (provider: Provider) => void;
}

const ProviderCard = ({
  provider,
  providerTasks,
  onEdit,
  onDelete,
  onAddProviderTask,
  onWatchProviderTasks,
}: ProviderCardProps) => {
  const { languageDirection } = useAppContext();

  return (
    <div
      className="flex flex-col justify-between rounded-lg bg-white p-4 border border-gray-200 animate-fade-in-0.5"
      dir={languageDirection}
    >
      <ProviderCardHeader provider={provider} />
      <ProviderCardContent
        provider={provider}
        providerTasks={providerTasks}
        onAddProviderTask={onAddProviderTask}
        onWatchProviderTasks={onWatchProviderTasks}
        paymentMethodLabel={PAYMENT_METHOD_LABEL}
      />
      <ProviderCardFooter provider={provider} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default ProviderCard;
