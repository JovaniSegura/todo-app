import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { environment } from '../config/environment';
import type { Todo } from '../types';

const api = axios.create({
  baseURL: environment.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('todo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useTodos = (userId: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<{ status: string; data: { todos: Todo[] } }>('/api/todos');
      setTodos(data.data.todos);
      setError(null);
    } catch (err) {
      setError('No se pudieron obtener las tareas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    try {
      const { data } = await api.post<{ status: string; data: { todo: Todo } }>('/api/todos', todo);
      setTodos((prev) => [...prev, data.data.todo]);
      return data.data.todo;
    } catch (err) {
      throw new Error('No se pudo crear la tarea');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTodos();
    }
  }, [userId, fetchTodos]);

  return {
    todos,
    loading,
    error,
    createTodo,
    refreshTodos: fetchTodos,
  };
};