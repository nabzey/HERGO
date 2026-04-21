import { mockTravelApi } from '../../services/mockTravelApi';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData;

const extractList = <T>(payload: unknown, key: string): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as Record<string, unknown>)[key])) {
    return (payload as Record<string, unknown>)[key] as T[];
  }

  return [];
};

const extractItem = <T>(payload: unknown, key: string): T => {
  if (payload && typeof payload === 'object' && key in (payload as Record<string, unknown>)) {
    return (payload as Record<string, unknown>)[key] as T;
  }

  return payload as T;
};

const getAuthToken = (): string | null => {
  // Essayer d'abord de récupérer le token depuis hergoToken
  const token = localStorage.getItem('hergoToken');
  if (token) {
    return token;
  }
  
  // Fallback: essayer de récupérer depuis hergoUser (pour compatibilité)
  const user = localStorage.getItem('hergoUser');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token || null;
    } catch {
      return null;
    }
  }
  return null;
};

const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, headers = {} } = options;
  
  const token = getAuthToken();
  const defaultHeaders: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData(body) ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    ...(body !== undefined && { body: isFormData(body) ? body : JSON.stringify(body) }),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch {
    throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion.');
  }
  
  if (!response.ok) {
    let message = `Erreur ${response.status}`;
    if (response.status === 401) message = 'Session expirée. Veuillez vous reconnecter.';
    else if (response.status === 403) message = 'Accès refusé.';
    else if (response.status === 404) message = 'Ressource introuvable.';
    else if (response.status >= 500) message = 'Erreur serveur. Veuillez réessayer plus tard.';

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch { /* ignore parse error */ }

    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
};

// Auth API
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    phoneCountryCode?: string;
    phoneNationalNumber?: string;
  }) =>
    apiRequest<{ user: unknown; token?: string; refreshToken?: string; continuationLink?: string }>('/auth/register', { method: 'POST', body: data }),
  
  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: unknown; token: string; refreshToken?: string }>('/auth/login', { method: 'POST', body: data }),
  
  getCurrentUser: () =>
    apiRequest<unknown>('/auth/me'),
  
  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/auth/forgot-password', { method: 'POST', body: { email } }),
  
  verifyOtp: (email: string, otp: string) =>
    apiRequest<{ success: boolean }>('/auth/verify-otp', { method: 'POST', body: { email, otp } }),
  
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    apiRequest<{ message: string }>('/auth/reset-password', { method: 'POST', body: data }),
};

// Users API
export const usersApi = {
  getProfile: () =>
    apiRequest<unknown>('/users/profile'),
  
  updateProfile: (data: unknown) =>
    apiRequest<unknown>('/users/profile', { method: 'PUT', body: data }),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<unknown>('/users/password', { method: 'PUT', body: data }),

  uploadAvatar: (formData: FormData) =>
    apiRequest<{ avatarUrl: string }>('/users/profile/avatar', { method: 'POST', body: formData }),
  
  getMyReservations: async () =>
    extractList<unknown>(await apiRequest('/users/reservations'), 'reservations'),
  
  getMyReviews: async () =>
    extractList<unknown>(await apiRequest('/users/reviews'), 'reviews'),
  
  getMyNotifications: async () =>
    extractList<unknown>(await apiRequest('/users/notifications'), 'notifications'),
};

// Logements API
export const logementsApi = {
  getAll: async (params?: Record<string, string>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return extractList<unknown>(await apiRequest(`/logements${queryString}`), 'logements');
  },
  
  getMyLogements: async () =>
    extractList<unknown>(await apiRequest('/logements/me'), 'logements'),
  
  getById: async (id: string | number) => {
    try {
      return await apiRequest<unknown>(`/logements/${id}`);
    } catch (error) {
      const logement = mockTravelApi.getLogementById(Number(id));
      if (!logement) {
        throw error;
      }
      return { logement };
    }
  },
  
  create: async (data: unknown) =>
    extractItem<unknown>(await apiRequest('/logements', { method: 'POST', body: data }), 'logement'),
  
  update: async (id: string | number, data: unknown) =>
    extractItem<unknown>(await apiRequest(`/logements/${id}`, { method: 'PUT', body: data }), 'logement'),
  
  delete: (id: string | number) =>
    apiRequest<unknown>(`/logements/${id}`, { method: 'DELETE' }),
  
  uploadImage: (id: string | number, data: FormData) =>
    apiRequest<unknown>(`/logements/${id}/images/upload`, { method: 'POST', body: data }),
  
  manageImages: async (id: string | number, images: string[]) =>
    extractItem<unknown>(
      await apiRequest(`/logements/${id}/images`, { method: 'PUT', body: { images } }),
      'logement'
    ),
  
  manageEquipements: async (id: string | number, equipements: string[]) =>
    extractItem<unknown>(
      await apiRequest(`/logements/${id}/equipements`, { method: 'PUT', body: { equipements } }),
      'logement'
    ),
  
  manageEspaces: async (id: string | number, espaces: unknown[]) =>
    extractItem<unknown>(
      await apiRequest(`/logements/${id}/espaces`, { method: 'PUT', body: { espaces } }),
      'logement'
    ),
};

// Reservations API
export const reservationsApi = {
  getAll: async () => {
    try {
      return extractList<unknown>(await apiRequest('/reservations'), 'reservations');
    } catch {
      return mockTravelApi.getReservations();
    }
  },
  
  getById: async (id: string | number) => {
    try {
      return await apiRequest<unknown>(`/reservations/${id}`);
    } catch (error) {
      const reservation = mockTravelApi.getReservationById(Number(id));
      if (!reservation) {
        throw error;
      }
      return { reservation };
    }
  },
  
  create: async (data: unknown) => {
    try {
      return extractItem<unknown>(await apiRequest('/reservations', { method: 'POST', body: data }), 'reservation');
    } catch {
      const reservation = mockTravelApi.createReservation(data as {
        idLogement: number;
        dateDebut: string;
        dateFin: string;
        nombrePersonnes: number;
      });
      return reservation;
    }
  },
  
  updateStatus: async (id: string | number, data: { statut?: string; status?: string }) =>
    extractItem<unknown>(
      await apiRequest(`/reservations/${id}/status`, {
        method: 'PUT',
        body: { statut: data.statut || data.status },
      }),
      'reservation'
    ),
  
  cancel: async (id: string | number) => {
    try {
      return await apiRequest<unknown>(`/reservations/${id}/cancel`, { method: 'PUT' });
    } catch {
      return mockTravelApi.cancelReservation(Number(id));
    }
  },
  
  delete: (id: string | number) =>
    apiRequest<unknown>(`/reservations/${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  getByLogement: async (logementId: string | number) =>
    extractList<unknown>(await apiRequest(`/reviews/logement/${logementId}`), 'reviews'),
  
  getById: (id: string | number) =>
    apiRequest<unknown>(`/reviews/${id}`),
  
  create: (data: unknown) =>
    apiRequest<unknown>('/reviews', { method: 'POST', body: data }),
  
  update: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/reviews/${id}`, { method: 'PUT', body: data }),
  
  delete: (id: string | number) =>
    apiRequest<unknown>(`/reviews/${id}`, { method: 'DELETE' }),
};

// Notifications API
export const notificationsApi = {
  getAll: async () =>
    extractList<unknown>(await apiRequest('/notifications'), 'notifications'),
  
  getById: (id: string | number) =>
    apiRequest<unknown>(`/notifications/${id}`),
  
  markAsRead: (id: string | number) =>
    apiRequest<unknown>(`/notifications/${id}/read`, { method: 'PUT' }),
  
  markAllAsRead: () =>
    apiRequest<unknown>('/notifications/read-all', { method: 'PUT' }),
  
  delete: (id: string | number) =>
    apiRequest<unknown>(`/notifications/${id}`, { method: 'DELETE' }),
  
  deleteAll: () =>
    apiRequest<unknown>('/notifications/delete-all', { method: 'DELETE' }),
};

// Admin API
export const adminApi = {
  getStatistics: () =>
    apiRequest<unknown>('/admin/statistics'),
  
  getAllUsers: async () =>
    extractList<unknown>(await apiRequest('/admin/users'), 'users'),
  
  getUserById: (id: string | number) =>
    apiRequest<unknown>(`/admin/users/${id}`),
  
  updateUser: async (id: string | number, data: { role?: string; status?: string }) =>
    extractItem<unknown>(await apiRequest(`/admin/users/${id}`, { method: 'PUT', body: data }), 'user'),
  
  deleteUser: (id: string | number) =>
    apiRequest<unknown>(`/admin/users/${id}`, { method: 'DELETE' }),
  
  getAllLogements: async () =>
    extractList<unknown>(await apiRequest('/admin/logements'), 'logements'),
  
  updateLogementStatus: async (id: string | number, data: { statut?: string; status?: string }) =>
    extractItem<unknown>(
      await apiRequest(`/admin/logements/${id}/status`, {
        method: 'PUT',
        body: { statut: data.statut || data.status },
      }),
      'logement'
    ),
  
  deleteLogement: (id: string | number) =>
    apiRequest<unknown>(`/admin/logements/${id}`, { method: 'DELETE' }),
  
  getAllReservations: async () =>
    extractList<unknown>(await apiRequest('/admin/reservations'), 'reservations'),
  
  getAllReclamations: async () =>
    extractList<unknown>(await apiRequest('/admin/reclamations'), 'reclamations'),
  
  updateReclamationStatus: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/admin/reclamations/${id}/status`, { method: 'PUT', body: data }),
  
  deleteReclamation: (id: string | number) =>
    apiRequest<unknown>(`/admin/reclamations/${id}`, { method: 'DELETE' }),
};

// Reclamations API
export const reclamationsApi = {
  create: (data: unknown) =>
    apiRequest<unknown>('/reclamations', { method: 'POST', body: data }),
  
  getMyReclamations: () =>
    apiRequest<unknown[]>('/reclamations/my'),
  
  getById: (id: string | number) =>
    apiRequest<unknown>(`/reclamations/${id}`),
};

// Payments API
export const paymentsApi = {
  createIntent: (data: { reservationId: number; paymentType: string }) =>
    apiRequest<any>('/payments/create-intent', { method: 'POST', body: data }),
  simulateMobileMoney: (data: { reservationId: number; amount: number; method: string; phoneNumber: string }) =>
    apiRequest<any>('/payments/simulate-mobile-money', { method: 'POST', body: data }),
};

// Calendar API
export const calendarApi = {
  getEvents: (month: number, year: number) =>
    apiRequest<unknown[]>(`/calendar?month=${month}&year=${year}`),
  
  createEvent: (data: unknown) =>
    apiRequest<unknown>('/calendar', { method: 'POST', body: data }),
  
  updateEvent: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/calendar/${id}`, { method: 'PUT', body: data }),
  
  deleteEvent: (id: string | number) =>
    apiRequest<unknown>(`/calendar/${id}`, { method: 'DELETE' }),
};

// Settings API
export const settingsApi = {
  get: () =>
    apiRequest<unknown>('/settings'),
  
  update: (data: unknown) =>
    apiRequest<unknown>('/settings', { method: 'PUT', body: data }),
};

// Favoris API
export const favorisApi = {
  getAll: async () => {
    try {
      return extractList<unknown>(await apiRequest('/favoris'), 'favoris');
    } catch {
      return mockTravelApi.getFavoris();
    }
  },
  
  add: async (idLogement: number) => {
    try {
      return await apiRequest<unknown>('/favoris', { method: 'POST', body: { idLogement } });
    } catch {
      return mockTravelApi.addFavori(idLogement);
    }
  },
  
  remove: async (idLogement: number) => {
    try {
      return await apiRequest<unknown>(`/favoris/${idLogement}`, { method: 'DELETE' });
    } catch {
      mockTravelApi.removeFavori(idLogement);
      return { success: true };
    }
  },
  
  check: async (idLogement: number) => {
    try {
      const result = await apiRequest<{ isFavori: boolean }>(`/favoris/check/${idLogement}`);
      return result.isFavori;
    } catch {
      return mockTravelApi.isFavori(idLogement);
    }
  },
};
