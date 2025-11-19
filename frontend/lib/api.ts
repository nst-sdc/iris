// API utilities for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5657';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(fetchOptions.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    // Try to parse JSON error body, otherwise include raw text and status
    let parsed: any = null;
    try {
      parsed = await response.json();
    } catch (e) {
      const text = await response.text().catch(() => '');
      const msg = text || `HTTP ${response.status}`;
      throw new Error(`Request failed: ${msg}`);
    }

    const message = parsed?.message || parsed?.error || JSON.stringify(parsed);
    throw new Error(`Request failed (${response.status}): ${message}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  githubLogin: () => `${API_BASE_URL}/auth/github`,
};

// Users API
export const usersAPI = {
  getAll: (token: string) => apiFetch('/users', { token }),
  getMembers: (token: string) => apiFetch('/members', { token }),
  create: (token: string, data: any) => apiFetch('/users', { method: 'POST', token, body: JSON.stringify(data) }),
  updateRole: (token: string, data: any) => apiFetch('/users/role', { method: 'POST', token, body: JSON.stringify(data) }),
  delete: (token: string, data: any) => apiFetch('/users', { method: 'DELETE', token, body: JSON.stringify(data) }),
};

// Projects API
export const projectsAPI = {
  getAll: (token?: string) => apiFetch('/projects', token ? { token } : {}),
  getUser: (token: string, userId: string) => apiFetch('/projects/user', { method: 'POST', token, body: JSON.stringify(userId) }),
  create: (token: string, data: any) => apiFetch('/projects/admin', { method: 'POST', token, body: JSON.stringify(data) }),
  update: (token: string, data: any) => apiFetch('/projects/admin', { method: 'PATCH', token, body: JSON.stringify(data) }),
  assign: (token: string, data: any) => apiFetch('/projects/assign', { method: 'POST', token, body: JSON.stringify(data) }),
  remove: (token: string, data: any) => apiFetch('/projects/remove-member', { method: 'POST', token, body: JSON.stringify(data) }),
  setLead: (token: string, data: any) => apiFetch('/projects/lead', { method: 'POST', token, body: JSON.stringify(data) }),
  delete: (token: string, data: any) => apiFetch('/projects/admin', { method: 'DELETE', token, body: JSON.stringify(data) }),
  // Join requests
  createJoinRequest: (token: string, data: { project_id: string; message: string }) => 
    apiFetch('/projects/join-request', { method: 'POST', token, body: JSON.stringify(data) }),
  getJoinRequests: (token: string, projectId: string) => 
    apiFetch(`/projects/${projectId}/join-requests`, { token }),
  updateJoinRequest: (token: string, requestId: string, status: 'approved' | 'rejected') => 
    apiFetch(`/projects/join-request/${requestId}`, { method: 'PATCH', token, body: JSON.stringify({ status }) }),
};

// Coins API
export const coinsAPI = {
  manage: (token: string, data: any) => apiFetch('/coins/manage', { method: 'POST', token, body: JSON.stringify(data) }),
  getTransactions: (token: string, userId: string) => apiFetch('/coins/transactions', { method: 'POST', token, body: JSON.stringify(userId) }),
  getLeaderboard: () => apiFetch('/coins/leaderboard', {}),
  saveLeaderboard: (token: string) => apiFetch('/coins/leaderboard/save', { method: 'POST', token }),
};

// Messages API
export const messagesAPI = {
  send: (token: string, data: any) => apiFetch('/messages/send', { method: 'POST', token, body: JSON.stringify(data) }),
  getUser: (token: string, userId: string) => apiFetch('/messages/user', { method: 'POST', token, body: JSON.stringify({ user_id: userId }) }),
  getAll: (token: string) => apiFetch('/messages', { token }),
};
