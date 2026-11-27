const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('healthsrs_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const fieldMsg = data?.fields
      ? Object.entries(data.fields)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : '';
    const errMsg = fieldMsg || data?.message || `Request failed (${res.status})`;
    const error = new Error(errMsg);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me'),

  // Coaches
  getCoaches: () => request('/api/coaches'),
  createCoach: (payload) => request('/api/coaches', { method: 'POST', body: JSON.stringify(payload) }),
  updateCoach: (id, payload) => request(`/api/coaches/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCoach: (id) => request(`/api/coaches/${id}`, { method: 'DELETE' }),

  // Applications
  getAllApplications: () => request('/api/applications'),
  getReviewApplications: () => request('/api/applications/review'),
  getMyApplications: () => request('/api/applications/my'),
  createApplication: (payload) => request('/api/applications', { method: 'POST', body: JSON.stringify(payload) }),
  updateApplication: (id, payload) => request(`/api/applications/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateApplicationStatus: (id, payload) =>
    request(`/api/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Users (Admin)
  getUsers: () => request('/api/users'),
  createUser: (payload) => request('/api/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE' }),
};
