"use client";
import { useState, useEffect } from "react";
import { Todo, TodoStatus } from "@/types/Todo";
import CustomButton, { ButtonSize } from "@/components/Button/custom-button";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TodoFormData) => void;
  todo?: Todo | null;
}

export interface TodoFormData {
  name: string;
  description: string;
  status: TodoStatus;
  reminderTimestamp: number;
  updatedBy: string;
}

const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: TodoStatus.PENDING, label: "ממתין" },
  { value: TodoStatus.IN_PROGRESS, label: "בתהליך" },
  { value: TodoStatus.COMPLETED, label: "הושלם" },
];

export default function TodoModal({
  isOpen,
  onClose,
  onSave,
  todo,
}: TodoModalProps) {
  const [name, setName] = useState(todo?.name || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.PENDING);
  const [reminderTimestamp, setReminderTimestamp] = useState<number>(0);
  const [updatedBy, setUpdatedBy] = useState(todo?.updatedBy || "");

  const isEdit = !!todo;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name, 
      description,
      status,
      reminderTimestamp,
      updatedBy,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-right">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {isEdit ? "עריכת משימה" : "הוספת משימה חדשה"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              שם
            </label>
            <input
              dir="rtl"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-right rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              תיאור
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              dir="rtl"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 text-right">
              סטטוס
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TodoStatus)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              תזכורת (timestamp)
            </label>
            <input
              type="number"
              value={reminderTimestamp || ""}
              onChange={(e) =>
                setReminderTimestamp(Number(e.target.value) || 0)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              עודכן על ידי
            </label>
            <input
              type="text"
              value={updatedBy}
              dir="rtl"
              onChange={(e) => setUpdatedBy(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <CustomButton size={ButtonSize.SM} type="button" onClick={onClose}>
              ביטול
            </CustomButton>
            <CustomButton size={ButtonSize.SM} type="submit">
              {isEdit ? "שמור שינויים" : "הוסף משימה"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
