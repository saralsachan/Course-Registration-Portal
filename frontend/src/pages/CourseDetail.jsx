import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, registerForCourse } from '../api/courses';
import { useAuth } from '../context/AuthContext';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  async function fetchCourse() {
    try {
      const data = await getCourse(id);
      setCourse(data);
    } catch (err) {
      setError('Could not load course.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!user) {
      navigate('/login');
      return;
    }
    setMessage('');
    setRegistering(true);
    try {
      await registerForCourse(id);
      setMessage('✓ Registration submitted! Status: pending admin approval.');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Could not register.';
      setMessage(`✗ ${detail}`);
    } finally {
      setRegistering(false);
    }
  }

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-400">{error}</p>;
  if (!course) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-blue-400 hover:underline">← Back to courses</Link>

      <div className="bg-gray-800 p-8 rounded-lg mt-4">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-300 mb-6">{course.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Instructor</p>
            <p className="font-semibold">{course.instructor}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Schedule</p>
            <p className="font-semibold">{course.schedule}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Capacity</p>
            <p className="font-semibold">{course.capacity}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Seats remaining</p>
            <p className="font-semibold">{course.seats_remaining}</p>
          </div>
        </div>

        {message && (
          <p className={`mb-4 ${message.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={registering || course.seats_remaining <= 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-semibold"
        >
          {course.seats_remaining <= 0
            ? 'Course Full'
            : registering
            ? 'Registering...'
            : 'Register for Course'}
        </button>
      </div>
    </div>
  );
}

export default CourseDetail;