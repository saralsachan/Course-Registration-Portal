import { useState, useEffect } from 'react';
import {
  getRegistrations,
  acceptRegistration,
  rejectRegistration,
} from '../../api/registrations';

function RegistrationManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

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

  async function handleAccept(id) {
    try {
      const updated = await acceptRegistration(id);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      const detail = err.response?.data?.detail || 'Could not accept.';
      alert(detail);
    }
  }

  async function handleReject(id) {
    try {
      const updated = await rejectRegistration(id);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      alert('Could not reject.');
    }
  }

  if (loading) return <p>Loading registrations...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const filtered =
    filter === 'all' ? registrations : registrations.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'accepted', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              filter === f ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400">No registrations to show.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((reg) => (
            <div
              key={reg.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{reg.course_title}</p>
                <p className="text-sm text-gray-400">
                  {reg.user.username} ({reg.user.email}) ·{' '}
                  {new Date(reg.registered_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <StatusBadge status={reg.status} />
                {reg.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(reg.id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(reg.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
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

export default RegistrationManager;