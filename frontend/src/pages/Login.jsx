import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState(''); /*useState('') returns [value, functionToUpdateValue] */
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-800 p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            required
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-2 rounded font-semibold"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-gray-400">
        No account?{' '}
        <Link to="/register" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;