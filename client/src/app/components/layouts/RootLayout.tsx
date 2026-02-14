import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}
