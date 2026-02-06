"use client";
import { createContext, useContext, useEffect, useState } from 'react'
import { Todo } from '../types/Todo';
import { getFromLocalStorage, setToLocalStorage } from '@/lib/utils';
import { LanguageDirection } from '@/types/General';
import { MAZAL_TOV_TODOS_KEY } from '@/constants/localStorage';


interface AppContextType {
  languageDirection: LanguageDirection,
  rowDirectionClassName: string,
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: number, todo: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  removeTodo: (id: number) => void;
}
export const AppContext = createContext<AppContextType>({
  languageDirection: LanguageDirection.ENG, 
  rowDirectionClassName: "",
  todos: [],
  setTodos: () => {},
  addTodo: () => {},
  updateTodo: () => {},
  removeTodo: () => {},
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [languageDirection, setLangugageDirection] = useState<LanguageDirection>(LanguageDirection.HEB)
  const [rowDirectionClassName, setRowDirectionClassName] = useState<string>("flex-row-reverse")
  useEffect(() => {
  setTodos(getFromLocalStorage(MAZAL_TOV_TODOS_KEY, []))
  }, [])

  useEffect(() => {
    setRowDirectionClassName(languageDirection === LanguageDirection.HEB ? "flex-row-reverse" : "flex-row")
  }, [languageDirection])

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
    <AppContext.Provider value={{ todos, setTodos, addTodo, updateTodo, removeTodo, languageDirection, rowDirectionClassName }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext has an error")
  }
  return context;
}

export default AppProvider;