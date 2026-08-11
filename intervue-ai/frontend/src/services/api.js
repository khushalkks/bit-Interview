const BASE_URL = 'http://localhost:8000/api';

/**
 * Custom fetch wrapper with automatic JWT token attachment
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('bit_interview_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'An unexpected error occurred');
  }

  return data;
}

export const authAPI = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, targetRole) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, target_role: targetRole }),
    }),

  getMe: () => apiFetch('/auth/me'),
};

export const dashboardAPI = {
  getSummary: () => apiFetch('/dashboard/summary'),
};
