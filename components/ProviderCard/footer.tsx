"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPhone, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import type { Provider } from "@/types/Provider";
import { getMobileUrl, getWhatsappUrl } from "@/components/Providers/helper";
import { useMemo } from "react";
import Tooltip from "@/components/Tooltip";

interface ProviderCardFooterProps {
  provider: Provider;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
}

const ProviderCardFooter = ({ provider, onEdit, onDelete }: ProviderCardFooterProps) => {
  const { phone } = provider;
  const hasPhone = !!phone && phone.trim().length > 0;
  const whatsappUrl = useMemo(() => getWhatsappUrl(phone || ""), [phone]);
  const mobileUrl = useMemo(() => getMobileUrl(phone || ""), [phone]);

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onDelete(provider)}
          className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          type="button"
          onClick={() => onEdit(provider)}
          className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
      {hasPhone && (
        <div className="flex items-center gap-2">
          <Tooltip
            content="התקשר לספק"
            place="top"
            className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors"
          >
            <FontAwesomeIcon
              icon={faPhone}
              className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors"
              onClick={() => window.open(mobileUrl, "_blank")}
            />
          </Tooltip>
          <a
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer text-green-500 hover:text-green-600 transition-colors"
            aria-label="שלח הודעת ווטסאפ"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>
      )}
    </div>
  );
};

export default ProviderCardFooter;
