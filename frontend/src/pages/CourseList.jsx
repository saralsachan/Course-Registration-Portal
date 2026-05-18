import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../api/courses';
import { useAuth } from '../context/AuthContext';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

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

  if (loading) return <p className="text-center mt-8">Loading courses...</p>;
  if (error) return <p className="text-center mt-8 text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {!user && (
        <p className="mb-4 text-gray-400">
          <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
          {' '}to register for courses.
        </p>
      )}

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-gray-800 hover:bg-gray-700 p-5 rounded-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
              <div className="text-sm text-gray-300 space-y-1">
                <p>👨‍🏫 {course.instructor}</p>
                <p>📅 {course.schedule}</p>
                <p>
                  💺 {course.seats_remaining} / {course.capacity} seats left
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;