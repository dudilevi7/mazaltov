"use client";
import { Todo, TodoStatus } from "@/types/Todo";
import TodoItem from "@/components/TodoItem";

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onStatusChange?: (todo: Todo, newStatus: TodoStatus) => void;
}

export default function TodoList({ todos, onEdit, onDelete, onStatusChange }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <li className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
        אין משימות. הוסף משימה חדשה כדי להתחיל.
      </li>
    );
  }

  return (
    <>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </>
  );
}
