const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export async function loginApi(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerApi(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getUsersApi(token) {
  return request('/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getTasksApi(token) {
  return request('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getTaskByIdApi(token, taskId) {
  return request(`/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getUserTasksApi(token, userId) {
  return request(`/users/${userId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createTaskApi(token, payload) {
  return request('/tasks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateTaskApi(token, taskId, payload) {
  return request(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}