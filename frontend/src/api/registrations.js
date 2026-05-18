import client from './client';

export async function getRegistrations() {
  const response = await client.get('/registrations/');
  return response.data;
}

export async function acceptRegistration(id) {
  const response = await client.post(`/registrations/${id}/accept/`);
  return response.data;
}

export async function rejectRegistration(id) {
  const response = await client.post(`/registrations/${id}/reject/`);
  return response.data;
}