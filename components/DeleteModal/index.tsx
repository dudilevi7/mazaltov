"use client";
import CustomButton from "@/components/Button/custom-button";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-right">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-xl font-semibold text-gray-900">
         ?האם אתה רוצה למחוק את המשימה
        </h2>
        <span>{title}</span>
        <div className="flex gap-2 justify-end pt-2">
          <CustomButton variant="white" onClick={onClose}>
            ביטול
          </CustomButton>
          <CustomButton variant="red" onClick={onConfirm}>
            מחק
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
