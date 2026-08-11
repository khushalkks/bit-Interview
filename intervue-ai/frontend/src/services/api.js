const BASE_URL = 'http://localhost:8000/api';

/**
 * Custom fetch wrapper with automatic JWT token attachment
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('bit_interview_token');

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Only set Content-Type to application/json if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (response.status === 204) {
    return null;
  }

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

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch('/resume/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getMe: () => apiFetch('/resume/me'),

  delete: () =>
    apiFetch('/resume/me', {
      method: 'DELETE',
    }),
};
