import { useState, useEffect } from 'react';
import { authApi } from '../core/api/api';

export type UserRole = 'Voyageur' | 'Hôte' | 'Admin';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('hergoUser');
    const token = localStorage.getItem('hergoToken');
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('hergoUser');
        localStorage.removeItem('hergoToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    try {
      const response = await authApi.login({ email, password });
      const userData = response.user as AuthUser;
      
      // Sauvegarder l'utilisateur et le token
      localStorage.setItem('hergoUser', JSON.stringify(userData));
      localStorage.setItem('hergoToken', response.token);
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: string }): Promise<AuthUser> => {
    try {
      const response = await authApi.register(data);
      const userData = response.user as AuthUser;
      
      // Sauvegarder l'utilisateur et le token
      localStorage.setItem('hergoUser', JSON.stringify(userData));
      localStorage.setItem('hergoToken', response.token);
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hergoUser');
    localStorage.removeItem('hergoToken');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (roles: UserRole[]) => {
    return user && roles.includes(user.role);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
  };
};