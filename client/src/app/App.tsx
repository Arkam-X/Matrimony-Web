import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';
import { ThemeProvider } from '@/app/components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="matrimony-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
