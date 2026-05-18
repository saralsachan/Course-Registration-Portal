import { useState, useEffect } from 'react';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../../api/courses';
import CourseForm from './CourseForm';

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError('Could not load courses.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(course) {
    setEditing(course);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSubmit(data) {
    if (editing) {
      const updated = await updateCourse(editing.id, data);
      setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await createCourse(data);
      setCourses((prev) => [created, ...prev]);
    }
    closeForm();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Could not delete course.');
    }
  }

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400">{courses.length} course(s)</p>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          + New Course
        </button>
      </div>

      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{course.title}</p>
              <p className="text-sm text-gray-400">
                {course.instructor} · {course.schedule} ·{' '}
                {course.accepted_count}/{course.capacity} accepted
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(course)}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CourseForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitLabel={editing ? 'Update' : 'Create'}
        />
      )}
    </div>
  );
}

export default CourseManager;