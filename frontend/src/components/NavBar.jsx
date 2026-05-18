import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Course Portal
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-400">Courses</Link>
          {user && (
            <Link to="/my-registrations" className="hover:text-blue-400">
              My Registrations
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-blue-400">Admin</Link>
          )}
          {user ? (
            <>
              <span className="text-gray-400">Hi, {user.username}</span>
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;