export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  userId: string;
  completed: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstname: string;
  lastname: string;
}