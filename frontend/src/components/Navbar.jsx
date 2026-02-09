import { useNavigate } from 'react-router-dom';

function Navbar({ setIsAuthenticated, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
              📝 Blog App
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-700">
                Bonjour, <span className="font-semibold">{user.name}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
