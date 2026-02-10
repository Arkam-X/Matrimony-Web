import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { XCircle, Heart } from 'lucide-react';

export function RejectedProfile() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const users = useAppStore((state) => state.users);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.USER) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const user = users.find((u) => u.id === currentUser?.id);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile Not Approved
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Unfortunately, your profile could not be approved at this time.
        </p>
        
        {user?.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
              Reason for rejection:
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              {user.rejectionReason}
            </p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            If you believe this was a mistake or have updated your information, please contact our support team.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-gray-500 dark:text-gray-400">
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          <span className="text-sm">We appreciate your understanding</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
