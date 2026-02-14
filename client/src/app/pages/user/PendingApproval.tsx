import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { Clock, Heart } from 'lucide-react';

export function PendingApproval() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    // If an ADMIN somehow lands here → send to admin dashboard
    if (currentUser?.role === UserRole.ADMIN) {
      navigate("/admin/dashboard");
    }

    // If APPROVED user logs in → send to dashboard
    if (currentUser?.role === UserRole.USER && currentUser?.status === "APPROVED") {
      navigate("/user/dashboard");
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pending Approval
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your profile is currently under review by our admin team. You will receive access to the platform once your profile is approved.
        </p>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            This usually takes 24-48 hours. We'll notify you once the review is complete.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-gray-500 dark:text-gray-400">
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          <span className="text-sm">Thank you for your patience</span>
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
