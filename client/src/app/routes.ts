import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/app/components/layouts/RootLayout';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { AdminDashboard } from '@/app/pages/admin/AdminDashboard';
import { AdminUserManagement } from '@/app/pages/admin/AdminUserManagement';
import { AdminAdminManagement } from '@/app/pages/admin/AdminAdminManagement';
import { UserDashboard } from '@/app/pages/user/UserDashboard';
import { UserProfileView } from '@/app/pages/user/UserProfileView';
import { UserProfileEdit } from '@/app/pages/user/UserProfileEdit';
import { PendingApproval } from '@/app/pages/user/PendingApproval';
import { RejectedProfile } from '@/app/pages/user/RejectedProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'register',
        Component: RegisterPage,
      },
      {
        path: 'admin/dashboard',
        Component: AdminDashboard,
      },
      {
        path: 'admin/users',
        Component: AdminUserManagement,
      },
      {
        path: 'admin/admins',
        Component: AdminAdminManagement,
      },
      {
        path: 'user/dashboard',
        Component: UserDashboard,
      },
      {
        path: 'user/profile/:userId',
        Component: UserProfileView,
      },
      {
        path: 'user/edit-profile',
        Component: UserProfileEdit,
      },
      {
        path: 'user/pending',
        Component: PendingApproval,
      },
      {
        path: 'user/rejected',
        Component: RejectedProfile,
      },
    ],
  },
]);
