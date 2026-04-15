"use client";
import CustomButton, { ButtonSize } from "@/components/Button/custom-button";
import Modal from "@/components/Shared/Modal";
import { useAppContext } from "@/context/AppContext";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title=""
}: DeleteModalProps) {
  const { languageDirection } = useAppContext();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="text-right"
      showCloseButton={false}
      actions={
        <>
          <CustomButton size={ButtonSize.SM} variant="white" onClick={onClose}>
            ביטול
          </CustomButton>
          <CustomButton size={ButtonSize.SM} variant="red" onClick={onConfirm}>
            מחק
          </CustomButton>
        </>
      }>
      <div className="p-6">
        <h2 className="mb-1 text-xl font-semibold text-gray-900" dir={languageDirection}>
האם אתה רוצה למחוק את {title}? השינויים לא יישמרו.
        </h2>
      </div>
    </Modal>
  );
}
