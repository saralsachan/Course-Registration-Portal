import client from './client';

export async function login(username, password) {
  const response = await client.post('/auth/login/', { username, password });
  // Django returns { access, refresh }
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
}

export async function register(username, email, password) {
  const response = await client.post('/auth/register/', { username, email, password });
  return response.data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}