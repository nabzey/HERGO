import { useState, useEffect } from 'react';
import { authApi } from '../core/api/api';
import { usersMockApi } from '../services/usersMockApi';

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

type ApiRole = 'VOYAGEUR' | 'HOTE' | 'ADMIN' | 'Voyageur' | 'Hôte' | 'Admin';

const mapApiRoleToUiRole = (role: ApiRole): UserRole => {
  if (role === 'VOYAGEUR' || role === 'Voyageur') {
    return 'Voyageur';
  }
  if (role === 'HOTE' || role === 'Hôte') {
    return 'Hôte';
  }
  return 'Admin';
};

const normalizeUser = (user: AuthUser & { role: ApiRole }): AuthUser => ({
  ...user,
  role: mapApiRoleToUiRole(user.role),
});

export const getDashboardRoute = (role: UserRole) => {
  if (role === 'Voyageur') {
    return '/dashboard';
  }
  if (role === 'Hôte') {
    return '/hote/dashboard';
  }
  return '/admin/dashboard';
};

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
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        usersMockApi.syncAuthenticatedUser(normalizedUser);
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
      const userData = normalizeUser(response.user as AuthUser & { role: ApiRole });
      
      // Sauvegarder l'utilisateur et le token
      localStorage.setItem('hergoUser', JSON.stringify(userData));
      localStorage.setItem('hergoToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('hergoRefreshToken', response.refreshToken);
      }
      
      usersMockApi.syncAuthenticatedUser(userData);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    data: {
      name: string;
      email: string;
      password: string;
      role: string;
      phone?: string;
      phoneCountryCode?: string;
      phoneNationalNumber?: string;
    },
    options: { persistSession?: boolean } = {}
  ): Promise<AuthUser> => {
    try {
      const response = await authApi.register(data);
      const userData = normalizeUser(response.user as AuthUser & { role: ApiRole });

      if (options.persistSession !== false && response.token) {
        localStorage.setItem('hergoUser', JSON.stringify(userData));
        localStorage.setItem('hergoToken', response.token);
        if ('refreshToken' in response && typeof response.refreshToken === 'string') {
          localStorage.setItem('hergoRefreshToken', response.refreshToken);
        }
      }

      usersMockApi.ensureRegisteredUser(data);
      if (options.persistSession !== false) {
        usersMockApi.syncAuthenticatedUser(userData);
        setUser(userData);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hergoUser');
    localStorage.removeItem('hergoToken');
    localStorage.removeItem('hergoRefreshToken');
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
