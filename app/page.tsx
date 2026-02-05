"use client";
import { useState, useMemo } from "react";
import { useAppContext } from "../context/AppProvider";
import AppHeader from "@/components/AppHeader";
import TodoHeader from "@/components/TodoHeader";
import TodoList from "@/components/TodoList";
import TodoModal, { TodoFormData } from "@/components/TodoModal";
import DeleteModal from "@/components/DeleteModal";
import { Todo, TodoStatus } from "@/types/Todo";

export default function Home() {
  const { todos, addTodo, updateTodo, removeTodo } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) return todos;
    const q = searchQuery.toLowerCase().trim();
    return todos.filter(
      (todo) =>
        todo.name.toLowerCase().includes(q) ||
        todo.description.toLowerCase().includes(q) ||
        todo.updatedBy.toLowerCase().includes(q)
    );
  }, [todos, searchQuery]);

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSave = (data: TodoFormData) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data);
    } else {
      addTodo(data);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo);
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      removeTodo(todoToDelete.id);
      setTodoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTodoToDelete(null);
  };

  const handleStatusChange = (todo: Todo, newStatus: TodoStatus) => {
    updateTodo(todo.id, { status: newStatus });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex flex-row items-center justify-between">
        <AppHeader />
        <TodoHeader
          onAddClick={handleOpenCreate}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <ul className="flex flex-col gap-3 overflow-auto py-2 px-1">
        <TodoList
          todos={filteredTodos}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusChange}
        />
      </ul>

      {isModalOpen && (
        <TodoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          todo={editingTodo}
        />
      )}

      <DeleteModal
        isOpen={!!todoToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={todoToDelete?.name || ""}
      />
    </div>
  );
}
