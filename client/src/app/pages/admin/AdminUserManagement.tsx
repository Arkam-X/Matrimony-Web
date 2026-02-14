// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppStore } from "@/lib/store";
// import { UserRole, ProfileStatus, User } from "@/lib/types";
// import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
// import { AdminNavbar } from "@/app/components/admin/AdminNavbar";
// import { Search, Eye, Check, X, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { UserDetailModal } from "@/app/components/admin/UserDetailModal";

// import {
//   getAdminUsers,
//   rejectAdminUser,
//   deleteAdminUser,
//   approveAdminUser
// } from "@/lib/api";

// export function AdminUserManagement() {
//   const navigate = useNavigate();
//   const currentUser = useAppStore((state) => state.currentUser);

//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   /* ================= AUTH GUARD ================= */
//   useEffect(() => {
//     if (!currentUser || currentUser.role !== UserRole.ADMIN) {
//       navigate("/login");
//     }
//   }, [currentUser, navigate]);

//   /* ================= FETCH USERS ================= */
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await getAdminUsers();
//         setUsers(data);
//       } catch (err: any) {
//         toast.error(err.message || "Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   /* ================= ACTIONS ================= */

//   const handleReject = async (userId: string) => {
//     const reason = prompt("Enter rejection reason:");
//     if (!reason) return;

//     try {
//       await rejectAdminUser(userId, reason);

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === userId ? { ...u, status: ProfileStatus.REJECTED } : u
//         )
//       );

//       toast.success("Profile rejected");
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   const handleApprove = async (userId: string) => {
//     try {
//       await approveAdminUser(userId);

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === userId ? { ...u, status: ProfileStatus.APPROVED } : u
//         )
//       );

//       toast.success("Profile approved");
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   const handleDelete = async (userId: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await deleteAdminUser(userId);

//       setUsers((prev) => prev.filter((u) => u.id !== userId));

//       toast.success("User deleted successfully");
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   const handleViewDetails = (user: User) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   /* ================= FILTERING ================= */

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.surname.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || user.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   if (!currentUser || currentUser.role !== UserRole.ADMIN) return null;
//   if (loading) return null;

//   /* ================= UI ================= */

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       <AdminSidebar />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminNavbar />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               User Management
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage and review user profiles
//             </p>
//           </div>

//           {/* Search + Filter */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700"
//                 />
//               </div>

//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-2 border rounded-lg dark:bg-gray-700"
//               >
//                 <option value="all">All Status</option>
//                 <option value={ProfileStatus.PENDING}>Pending</option>
//                 <option value={ProfileStatus.APPROVED}>Approved</option>
//                 <option value={ProfileStatus.REJECTED}>Rejected</option>
//                 <option value={ProfileStatus.UNDER_REVIEW}>Under Review</option>
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
//             <table className="w-full">
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="border-b">
//                     <td className="p-4">
//                       {user.name} {user.surname}
//                       <div className="text-xs text-gray-500">{user.email}</div>
//                     </td>

//                     <td className="p-4">{user.gender}</td>
//                     <td className="p-4">{user.city}</td>
//                     <td className="p-4">{user.status}</td>

//                     <td className="p-4 flex gap-2">
//                       <button onClick={() => handleViewDetails(user)}>
//                         <Eye size={18} />
//                       </button>

//                       <button onClick={() => handleApprove(user.id)}>
//                         <Check size={18} />
//                       </button>

//                       <button onClick={() => handleReject(user.id)}>
//                         <X size={18} />
//                       </button>

//                       <button onClick={() => handleDelete(user.id)}>
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredUsers.length === 0 && (
//               <div className="p-8 text-center text-gray-500">
//                 No users found
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {selectedUser && (
//         <UserDetailModal
//           user={selectedUser}
//           isOpen={isModalOpen}
//           onClose={() => {
//             setSelectedUser(null);
//             setIsModalOpen(false);
//           }}
//           onReject={handleReject}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { UserRole, ProfileStatus, User } from "@/lib/types";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { AdminNavbar } from "@/app/components/admin/AdminNavbar";
import { Search, Eye, Check, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserDetailModal } from "@/app/components/admin/UserDetailModal";

import {
  getAdminUsers,
  rejectAdminUser,
  deleteAdminUser,
  approveAdminUser
} from "@/lib/api";

export function AdminUserManagement() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [currentUser]);

  /* ================= ACTIONS ================= */

  const handleReject = async (userId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason || !reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setActionLoading(userId);
    try {
      await rejectAdminUser(userId, reason);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: ProfileStatus.REJECTED } : u
        )
      );

      toast.success("Profile rejected successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to reject profile");
      console.error("Rejection error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await approveAdminUser(userId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: ProfileStatus.APPROVED } : u
        )
      );

      toast.success("Profile approved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve profile");
      console.error("Approval error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setActionLoading(userId);
    try {
      await deleteAdminUser(userId);

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
      console.error("Deletion error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  /* ================= FILTERING ================= */

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!currentUser || currentUser.role !== UserRole.ADMIN) return null;

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and review user profiles
            </p>
          </div>

          {/* Search + Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={ProfileStatus.PENDING}>Pending</option>
                <option value={ProfileStatus.APPROVED}>Approved</option>
                <option value={ProfileStatus.REJECTED}>Rejected</option>
                <option value={ProfileStatus.UNDER_REVIEW}>Under Review</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-4">Loading users...</p>
            </div>
          ) : (
            /* Table */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => {
                      const isLoading = actionLoading === user.id;
                      const isApproved = user.status === ProfileStatus.APPROVED;
                      const isRejected = user.status === ProfileStatus.REJECTED;

                      return (
                        <tr 
                          key={user.id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name} {user.surname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {user.gender}
                          </td>

                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                            {user.city}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === ProfileStatus.APPROVED
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : user.status === ProfileStatus.REJECTED
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : user.status === ProfileStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              {/* View Details */}
                              <button
                                onClick={() => handleViewDetails(user)}
                                disabled={isLoading}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>

                              {/* Approve */}
                              <button
                                onClick={() => handleApprove(user.id)}
                                disabled={isLoading || isApproved}
                                className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={isApproved ? "Already Approved" : "Approve"}
                              >
                                {isLoading ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <Check size={18} />
                                )}
                              </button>

                              {/* Reject */}
                              <button
                                onClick={() => handleReject(user.id)}
                                disabled={isLoading || isRejected}
                                className="p-2 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={isRejected ? "Already Rejected" : "Reject"}
                              >
                                {isLoading ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <X size={18} />
                                )}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={isLoading}
                                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete User"
                              >
                                {isLoading ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No users found matching your criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedUser(null);
            setIsModalOpen(false);
          }}
          onReject={handleReject}
        />
      )}
    </div>
  );
}