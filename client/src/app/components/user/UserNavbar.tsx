import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/components/ThemeProvider';
import { useAppStore } from '@/lib/store';

export function UserNavbar() {
  const { theme, setTheme } = useTheme();
  const currentUser = useAppStore((state) => state.currentUser);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome, {currentUser?.name}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
