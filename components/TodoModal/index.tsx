"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Todo, TodoStatus } from "@/types/Todo";
import CustomButton, { ButtonSize } from "@/components/Button/custom-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TodoFormData) => void;
  todo?: Todo | null;
  initialData?: Partial<TodoFormData>;
}

export interface TodoFormData {
  name: string;
  description: string;
  status: TodoStatus;
  reminderTimestamp: number;
  updatedBy: string;
  providerId?: number;
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
  initialData,
}: TodoModalProps) {
  const [name, setName] = useState(todo?.name || initialData?.name || "");
  const [description, setDescription] = useState(todo?.description || initialData?.description || "");
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.PENDING);
  const [reminderDate, setReminderDate] = useState<Date | null>(
    todo?.reminderTimestamp ? new Date(todo.reminderTimestamp) : null
  );
  const [updatedBy, setUpdatedBy] = useState(todo?.updatedBy || "");

  const isEdit = !!todo;

  useEffect(() => {
    if (isOpen) {
      setName(todo?.name || initialData?.name || "");
      setDescription(todo?.description || initialData?.description || "");
      setStatus(todo?.status ?? initialData?.status ?? TodoStatus.PENDING);
      setReminderDate(
        todo?.reminderTimestamp
          ? new Date(todo.reminderTimestamp)
          : initialData?.reminderTimestamp
            ? new Date(initialData.reminderTimestamp)
            : null
      );
      setUpdatedBy(todo?.updatedBy || initialData?.updatedBy || "");
    }
  }, [isOpen, todo, initialData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      status,
      reminderTimestamp: reminderDate ? reminderDate.getTime() : 0,
      updatedBy,
      providerId: todo?.providerId ?? initialData?.providerId,
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
              תזכורת
            </label>
            <DatePicker
              selected={reminderDate}
              onChange={(date: Date | null) => setReminderDate(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText="בחר תאריך ושעה"
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              isClearable
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
