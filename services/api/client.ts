const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request<{ status: string; database: string }>('/health'),

  users: {
    getByFirebaseUid: (uid: string) => request<Record<string, unknown>>(`/api/users/${uid}`),
    create: (data: Record<string, unknown>) =>
      request('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  },

  packages: {
    listByUser: (userId: string) => request<Record<string, unknown>[]>(`/api/packages/user/${userId}`),
    get: (id: string) => request<Record<string, unknown>>(`/api/packages/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/api/packages', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, data: Record<string, unknown>) =>
      request(`/api/packages/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  payments: {
    listByUser: (userId: string) => request<Record<string, unknown>[]>(`/api/payments/user/${userId}`),
    create: (data: Record<string, unknown>) =>
      request('/api/payments', { method: 'POST', body: JSON.stringify(data) }),
  },

  notifications: {
    listByUser: (userId: string) =>
      request<Record<string, unknown>[]>(`/api/notifications/user/${userId}`),
    markRead: (id: string) =>
      request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  },
};
