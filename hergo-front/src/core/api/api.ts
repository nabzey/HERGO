const API_BASE_URL = 'http://localhost:5000/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const getAuthToken = (): string | null => {
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
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    apiRequest<{ user: unknown; token: string }>('/auth/register', { method: 'POST', body: data }),
  
  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: unknown; token: string }>('/auth/login', { method: 'POST', body: data }),
  
  getCurrentUser: () =>
    apiRequest<unknown>('/auth/me'),
};

// Users API
export const usersApi = {
  getProfile: () =>
    apiRequest<unknown>('/users/profile'),
  
  updateProfile: (data: unknown) =>
    apiRequest<unknown>('/users/profile', { method: 'PUT', body: data }),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<unknown>('/users/password', { method: 'PUT', body: data }),
  
  getMyReservations: () =>
    apiRequest<unknown[]>('/users/reservations'),
  
  getMyReviews: () =>
    apiRequest<unknown[]>('/users/reviews'),
  
  getMyNotifications: () =>
    apiRequest<unknown[]>('/users/notifications'),
};

// Logements API
export const logementsApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<unknown[]>(`/logements${queryString}`);
  },
  
  getById: (id: string | number) =>
    apiRequest<unknown>(`/logements/${id}`),
  
  create: (data: unknown) =>
    apiRequest<unknown>('/logements', { method: 'POST', body: data }),
  
  update: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/logements/${id}`, { method: 'PUT', body: data }),
  
  delete: (id: string | number) =>
    apiRequest<unknown>(`/logements/${id}`, { method: 'DELETE' }),
  
  manageImages: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/logements/${id}/images`, { method: 'PUT', body: data }),
  
  manageEquipements: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/logements/${id}/equipements`, { method: 'PUT', body: data }),
  
  manageEspaces: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/logements/${id}/espaces`, { method: 'PUT', body: data }),
};

// Reservations API
export const reservationsApi = {
  getAll: () =>
    apiRequest<unknown[]>('/reservations'),
  
  getById: (id: string | number) =>
    apiRequest<unknown>(`/reservations/${id}`),
  
  create: (data: unknown) =>
    apiRequest<unknown>('/reservations', { method: 'POST', body: data }),
  
  updateStatus: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/reservations/${id}/status`, { method: 'PUT', body: data }),
  
  cancel: (id: string | number) =>
    apiRequest<unknown>(`/reservations/${id}/cancel`, { method: 'PUT' }),
  
  delete: (id: string | number) =>
    apiRequest<unknown>(`/reservations/${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  getByLogement: (logementId: string | number) =>
    apiRequest<unknown[]>(`/reviews/logement/${logementId}`),
  
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
  getAll: () =>
    apiRequest<unknown[]>('/notifications'),
  
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
  
  getAllUsers: () =>
    apiRequest<unknown[]>('/admin/users'),
  
  getUserById: (id: string | number) =>
    apiRequest<unknown>(`/admin/users/${id}`),
  
  updateUser: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/admin/users/${id}`, { method: 'PUT', body: data }),
  
  deleteUser: (id: string | number) =>
    apiRequest<unknown>(`/admin/users/${id}`, { method: 'DELETE' }),
  
  getAllLogements: () =>
    apiRequest<unknown[]>('/admin/logements'),
  
  updateLogementStatus: (id: string | number, data: unknown) =>
    apiRequest<unknown>(`/admin/logements/${id}/status`, { method: 'PUT', body: data }),
  
  deleteLogement: (id: string | number) =>
    apiRequest<unknown>(`/admin/logements/${id}`, { method: 'DELETE' }),
  
  getAllReservations: () =>
    apiRequest<unknown[]>('/admin/reservations'),
  
  getAllReclamations: () =>
    apiRequest<unknown[]>('/admin/reclamations'),
  
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