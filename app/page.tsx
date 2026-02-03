"use client";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppProvider";
import CustomButton from "@/components/Button/custom-button";
import TodoModal, { TodoFormData } from "@/components/TodoModal";
import { Todo, TodoStatus } from "@/types/Todo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRing, faUser } from "@fortawesome/free-solid-svg-icons";

const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: "ממתין",
  [TodoStatus.IN_PROGRESS]: "בתהליך",
  [TodoStatus.COMPLETED]: "הושלם",
};

export default function Home() {
  const { todos, addTodo, updateTodo, removeTodo } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans p-6">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div className="flex flex-row gap-1 items-center">
          <FontAwesomeIcon icon={faRing} className="text-gray-300 animate-pulse" size="2x" width={24}/>
          <h1 className="text-2xl font-bold text-gray-900 rounded-md ">TODO Wedding List Dudi & Chen</h1>
        </div>
        <CustomButton onClick={handleOpenCreate}>
          לחץ להוספת משימה
        </CustomButton>
      </div>

      <ul className="flex flex-col gap-3 overflow-auto py-2 px-1">
        {todos.length === 0 ? (
          <li className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
            אין משימות. הוסף משימה חדשה כדי להתחיל.
          </li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
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
                  <FontAwesomeIcon icon={faUser} className="text-gray-500"/>
                </div>
                <div className="flex shrink-0 gap-2">
                  <CustomButton onClick={() => handleOpenEdit(todo)}>
                    ערוך
                  </CustomButton>
                  <button
                    type="button"
                    onClick={() => removeTodo(todo.id)}
                    className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    מחק
                  </button>
                </div>
              </div>

            </li>
          ))
        )}
      </ul>

      {isModalOpen && 
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        todo={editingTodo}
      />}
    </div>
  );
}
