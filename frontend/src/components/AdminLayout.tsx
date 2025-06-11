import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';

const AdminLayout = () => {
const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Or sessionStorage.clear(); if you're using that
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             <Link to="/admin/dashboard" className="flex-shrink-0 flex items-center">
                        <div className="h-8 w-8 bg-teal-500 rounded-md flex items-center justify-center">
                            <span className="text-white font-semibold">MP</span>
                          </div>
                          <span className="ml-2 text-xl font-semibold text-slate-900">MindPulse</span>
                          </Link>
            <div className="flex space-x-4 items-center">
              <NavLink to="/admin/dashboard" className={({ isActive }) => navStyle(isActive)}>Dashboard</NavLink>
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
      <Outlet />
    </div>
  );
};

const navStyle = (isActive) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-teal-100 text-teal-700' : 'text-slate-500 hover:text-slate-700'}`;

export default AdminLayout;