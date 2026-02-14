import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/app/components/layouts/RootLayout";
import { LoginPage } from "@/app/pages/LoginPage";
import { RegisterPage } from "@/app/pages/RegisterPage";

import { AdminDashboard } from "@/app/pages/admin/AdminDashboard";
import { AdminUserManagement } from "@/app/pages/admin/AdminUserManagement";
import { AdminAdminManagement } from "@/app/pages/admin/AdminAdminManagement";

import { UserDashboard } from "@/app/pages/user/UserDashboard";
import { UserProfileView } from "@/app/pages/user/UserProfileView";
import { UserProfileEdit } from "@/app/pages/user/UserProfileEdit";
import { PendingApproval } from "@/app/pages/user/PendingApproval";
import { RejectedProfile } from "@/app/pages/user/RejectedProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,   // ✅ must be element
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      // ADMIN
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/users", element: <AdminUserManagement /> },
      { path: "admin/admins", element: <AdminAdminManagement /> },

      // USER
      { path: "user/dashboard", element: <UserDashboard /> },
      { path: "user/profile/:userId", element: <UserProfileView /> },
      { path: "user/edit-profile", element: <UserProfileEdit /> },
      { path: "user/pending", element: <PendingApproval /> },
      { path: "user/rejected", element: <RejectedProfile /> },
    ],
  },
]);
