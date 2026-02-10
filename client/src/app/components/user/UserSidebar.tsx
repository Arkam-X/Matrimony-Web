import { Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, User, Settings, LogOut, Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);

  const menuItems = [
    { path: '/user/dashboard', label: 'Browse Profiles', icon: LayoutDashboard },
    { path: '/user/edit-profile', label: 'My Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Matrimony</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Find Your Match</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
