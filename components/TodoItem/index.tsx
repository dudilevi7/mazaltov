"use client";
import { Todo, TodoStatus } from "@/types/Todo";
import CustomButton from "@/components/Button/custom-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: "ממתין",
  [TodoStatus.IN_PROGRESS]: "בתהליך",
  [TodoStatus.COMPLETED]: "הושלם",
};

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export default function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  return (
    <li
      className="flex flex-row-reverse items-center justify-between gap-4 rounded-lg bg-gray-100 p-4 inset-shadow-sm shadow-gray-500"
    >
      <div className="flex-1 text-right">
        <h3 className="font-medium text-gray-900">{todo.name}</h3>
        {todo.description && (
          <p className="mt-1 mx-2 truncate text-sm text-gray-600" dir="rtl">
            {todo.description}
          </p>
        )}
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            todo.status === TodoStatus.COMPLETED
              ? "bg-green-100 text-green-800"
              : todo.status === TodoStatus.IN_PROGRESS
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-200 text-gray-800"
          }`}
        >
          {STATUS_LABELS[todo.status]}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row mb-4 gap-0.5">
          <span className="text-sm text-gray-500">{todo.updatedBy} </span>
          <FontAwesomeIcon icon={faUser} className="text-gray-500" />
        </div>
        <div className="flex shrink-0 gap-2">
          <CustomButton onClick={() => onEdit(todo)}>ערוך</CustomButton>
          <CustomButton
            variant="red"
            onClick={() => onDelete(todo)}
          >
            מחק
          </CustomButton>
        </div>
      </div>
    </li>
  );
}
