import client from './client';

export async function getCourses() {
  const response = await client.get('/courses/');
  return response.data;
}

export async function getCourse(id) {
  const response = await client.get(`/courses/${id}/`);
  return response.data;
}

export async function createCourse(data) {
  const response = await client.post('/courses/', data);
  return response.data;
}

export async function updateCourse(id, data) {
  const response = await client.put(`/courses/${id}/`, data);
  return response.data;
}

export async function deleteCourse(id) {
  await client.delete(`/courses/${id}/`);
}

export async function registerForCourse(courseId) {
  const response = await client.post(`/courses/${courseId}/register/`);
  return response.data;
}