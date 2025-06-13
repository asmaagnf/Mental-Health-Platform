import { NavLink, useNavigate, Outlet } from 'react-router-dom';

const RefusedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // or sessionStorage.clear()
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              {/* You can add more NavLinks here if needed */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center text-gray-700 text-xl font-semibold mb-6">
         profile refuser
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default RefusedPage;
