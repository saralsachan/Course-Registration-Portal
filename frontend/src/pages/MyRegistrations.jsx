import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegistrations } from '../api/registrations';

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError('Could not load registrations.');
    } finally {
      setLoading(false);
    }
  }

  function statusBadge(status) {
    const colors = {
      pending: 'bg-yellow-600',
      accepted: 'bg-green-600',
      rejected: 'bg-red-600',
    };
    return (
      <span className={`${colors[status]} px-2 py-1 rounded text-xs font-semibold uppercase`}>
        {status}
      </span>
    );
  }

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Registrations</h1>

      {registrations.length === 0 ? (
        <p className="text-gray-400">
          You haven't registered for any courses yet.{' '}
          <Link to="/" className="text-blue-400 hover:underline">Browse courses</Link>.
        </p>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div key={reg.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <Link to={`/courses/${reg.course}`} className="text-lg font-semibold hover:text-blue-400">
                  {reg.course_title}
                </Link>
                <p className="text-sm text-gray-400">
                  Registered on {new Date(reg.registered_at).toLocaleDateString()}
                </p>
              </div>
              {statusBadge(reg.status)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;