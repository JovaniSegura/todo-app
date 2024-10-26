import { useState, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../config/environment';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

const TOKEN_KEY = 'todo_token';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        return {
          id: decoded.id,
          firstname: '',
          lastname: '',
          email: ''
        };
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
    }
    return null;
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { data } = await axios.post<{ status: string; data: AuthResponse }>(
        `${environment.apiUrl}/auth/login`,
        credentials
      );
      
      if (data.status === 'success' && data.data.token) {
        localStorage.setItem(TOKEN_KEY, data.data.token);
        setUser(data.data.user);
        return data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      throw new Error('Login failed');
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      const { data } = await axios.post<{ status: string; data: { user: User } }>(
        `${environment.apiUrl}/auth/register`,
        credentials
      );
      return data.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};