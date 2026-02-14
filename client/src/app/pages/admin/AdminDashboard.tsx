import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { AdminNavbar } from "@/app/components/admin/AdminNavbar";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { getAdminDashboardStats } from "@/lib/api";
import { toast } from "sonner";

export function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingProfiles: 0,
    approvedProfiles: 0,
    rejectedProfiles: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔐 Auth guard
  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // 🌐 Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboardStats();

        setStats({
          totalUsers: res.stats.totalUsers,
          pendingProfiles: res.stats.pendingUsers,
          approvedProfiles: res.stats.approvedUsers,
          rejectedProfiles: res.stats.rejectedUsers,
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!currentUser || currentUser.role !== UserRole.ADMIN) return null;
  if (loading) return null; // keep UI same

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Pending Profiles",
      value: stats.pendingProfiles,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Approved Profiles",
      value: stats.approvedProfiles,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Rejected Profiles",
      value: stats.rejectedProfiles,
      icon: UserX,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {currentUser.name}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {stat.value}
                      </p>
                    </div>

                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
