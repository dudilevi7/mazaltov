"use client";
import { createContext, useEffect, useState } from 'react'
import { Todo } from '../types/Todo';
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils';



const MAZAL_TOV_TODOS_KEY = "todosMazalTov"

interface AppContextType {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: number, todo: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  removeTodo: (id: number) => void;
}
export const AppContext = createContext<AppContextType>({
  todos: [],
  setTodos: () => {},
  addTodo: () => {},
  updateTodo: () => {},
  removeTodo: () => {},
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  useEffect(() => {
    setTodos(getFromLocalStorage(MAZAL_TOV_TODOS_KEY, []))
  }, [])

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newTodo: Todo = {
      ...todo,
      id: now,
      createdAt: now,
      updatedAt: now,
    };
    const newTodos = [...todos, newTodo]
    setTodos(newTodos);
    setToLocalStorage(MAZAL_TOV_TODOS_KEY, newTodos)
  };

  const updateTodo = (id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    const now = Date.now();
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: now } : t
    )
    setTodos(updatedTodos);
    setToLocalStorage(MAZAL_TOV_TODOS_KEY, updatedTodos)
  };

 
  const removeTodo = (id: number) => {
    const updatedTodos = todos.filter(t => t.id !== id);
    setTodos(updatedTodos);
    setToLocalStorage(MAZAL_TOV_TODOS_KEY, updatedTodos)
  };

  return (
    <AppContext.Provider value={{ todos, setTodos, addTodo, updateTodo, removeTodo }}>
      {children}
    </AppContext.Provider>
  )
}
export default AppProvider;