import { useState, useEffect } from 'react';
import type { User } from '../data/adminMockData';

export type UserRole = 'Voyageur' | 'Hôte' | 'Admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('hergoUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('hergoUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      // Simulation d'authentification avec les données mock
      const mockUsers = [
        {
          id: 1,
          name: 'Amadou Diallo',
          email: 'amadou.diallo@gmail.com',
          role: 'Voyageur' as UserRole,
          avatar: 'https://i.pravatar.cc/40?u=amadou',
        },
        {
          id: 2,
          name: 'Fatou Seck',
          email: 'fatou.seck@gmail.com',
          role: 'Hôte' as UserRole,
          avatar: 'https://i.pravatar.cc/40?u=fatou',
        },
        {
          id: 6,
          name: 'Aissatou Fall',
          email: 'aissatou.fall@hergo.sn',
          role: 'Admin' as UserRole,
          avatar: 'https://i.pravatar.cc/40?u=aissatou',
        },
      ];

      // Trouver l'utilisateur correspondant
      const foundUser = mockUsers.find(u => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('hergoUser', JSON.stringify(foundUser));
        resolve(foundUser);
      } else {
        reject(new Error('Identifiants incorrects'));
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hergoUser');
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
    logout,
    isAuthenticated,
    hasRole,
  };
};