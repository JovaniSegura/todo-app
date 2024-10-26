import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';

export default function TodoList() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { todos, loading, createTodo } = useTodos(user?.id || '');
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      await createTodo({
        title: newTodo.title,
        description: newTodo.description,
        userId: user?.id || '',
      });
      setNewTodo({ title: '', description: '' });
      setIsCreating(false);
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      toast.error('Error al crear la tarea');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white shadow rounded-lg p-6 flex items-start space-x-4"
            >
              {todo.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{todo.title}</p>
                <p className="text-sm text-gray-500">{todo.description}</p>
              </div>
            </div>
          ))}

          {isCreating ? (
            <form onSubmit={handleCreateTodo} className="bg-white shadow rounded-lg p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titulo
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Ingresa el titulo de la tarea"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Ingresa la descripción de la tarea"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Crear
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar nueva tarea
            </button>
          )}
        </div>
      </div>
    </div>
  );
}