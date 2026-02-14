export const API_BASE = "http://localhost:5000/api";

export async function loginUser(email: string, password: string) {
  // 1️⃣ Try USER login first
  let res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  let data = await res.json();

  // 2️⃣ If USER login fails → try ADMIN login
  if (!res.ok) {
    res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // 🔥 Normalize ADMIN response to match USER shape
    return {
      accessToken: data.token, // admin gives "token"
      user: {
        id: data.admin.id,
        name: data.admin.name,
        email: data.admin.email,
        role: "ADMIN",
      },
    };
  }

  // USER login success → return as-is
  return data;
}

export async function registerUser(payload: any) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function getBrowseProfiles() {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE}/users/browse`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load profiles");
  }

  return data.profiles; // backend should return { profiles: [...] }
}

export async function getAdminDashboardStats() {
  const token = localStorage.getItem("accessToken"); // ⭐ get stored token

  const res = await fetch("http://localhost:5000/api/admin/dashboard-stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ⭐ THIS WAS MISSING
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch dashboard stats");
  }

  return data;
}

/* ================= AUTH HEADER ================= */
// function getAuthHeader() {
//   const token = localStorage.getItem("accessToken");

//   return {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };
// }

// export const API_BASE_ADMIN = "http://localhost:5000/api/admin";

// /* ================= GET ALL USERS ================= */
// export async function getAdminUsers() {
//   const res = await fetch(`${API_BASE_ADMIN}/users`, {
//     headers: getAuthHeader(),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Failed to fetch users");
//   }

//   // supports both { users: [] } or []
//   return data.users ?? data;
// }

// /* ================= GET USER BY ID ================= */
// export async function getAdminUserById(userId: string) {
//   const res = await fetch(`${API_BASE_ADMIN}/users/${userId}`, {
//     headers: getAuthHeader(),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Failed to fetch user");
//   }

//   return data.user ?? data;
// }

// /* ================= REJECT USER ================= */
// export async function rejectAdminUser(userId: string, reason: string) {
//   const res = await fetch(`${API_BASE_ADMIN}/users/${userId}/reject`, {
//     method: "PATCH",
//     headers: getAuthHeader(),
//     body: JSON.stringify({ reason }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Reject failed");
//   }

//   return data;
// }

// /* ================= DELETE USER ================= */
// export async function deleteAdminUser(userId: string) {
//   const res = await fetch(`${API_BASE_ADMIN}/users/${userId}`, {
//     method: "DELETE",
//     headers: getAuthHeader(),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Delete failed");
//   }

//   return data;
// }

// // Approve User
// export async function approveAdminUser(userId: string) {
//   const res = await fetch(`${API_BASE_ADMIN}/users/${userId}/approve`, {
//     method: "PATCH",
//     headers: getAuthHeader(),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Approve failed");
//   }

//   return data;
// }
// api.ts - Improved version with better error handling

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.warn("No access token found in localStorage");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const API_BASE_ADMIN = "http://localhost:5000/api/admin";

/* ================= GET ALL USERS ================= */
export async function getAdminUsers() {
  try {
    const res = await fetch(`${API_BASE_ADMIN}/users`, {
      headers: getAuthHeader(),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("getAdminUsers failed:", {
        status: res.status,
        statusText: res.statusText,
        data,
      });
      throw new Error(data.message || "Failed to fetch users");
    }

    // supports both { users: [] } or []
    return data.users ?? data;
  } catch (error) {
    console.error("getAdminUsers error:", error);
    throw error;
  }
}

/* ================= GET USER BY ID ================= */
export async function getAdminUserById(userId: string) {
  try {
    const res = await fetch(`${API_BASE_ADMIN}/users/${userId}`, {
      headers: getAuthHeader(),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("getAdminUserById failed:", {
        userId,
        status: res.status,
        statusText: res.statusText,
        data,
      });
      throw new Error(data.message || "Failed to fetch user");
    }

    return data.user ?? data;
  } catch (error) {
    console.error("getAdminUserById error:", error);
    throw error;
  }
}

/* ================= APPROVE USER ================= */
export async function approveAdminUser(userId: string) {
  try {
    console.log("Approving user:", userId);

    const res = await fetch(`${API_BASE_ADMIN}/users/${userId}/approve`, {
      method: "PATCH",
      headers: getAuthHeader(),
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    if (!res.ok) {
      console.error("approveAdminUser failed:", {
        userId,
        status: res.status,
        statusText: res.statusText,
        data,
      });
      throw new Error(data.message || "Approve failed");
    }

    console.log("User approved successfully:", userId);
    return data;
  } catch (error) {
    console.error("approveAdminUser error:", error);
    throw error;
  }
}

/* ================= REJECT USER ================= */
export async function rejectAdminUser(userId: string, reason: string) {
  try {
    console.log("Rejecting user:", { userId, reason });

    const res = await fetch(`${API_BASE_ADMIN}/users/${userId}/reject`, {
      method: "PATCH",
      headers: getAuthHeader(),
      body: JSON.stringify({ reason }),
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    if (!res.ok) {
      console.error("rejectAdminUser failed:", {
        userId,
        reason,
        status: res.status,
        statusText: res.statusText,
        data,
      });
      throw new Error(data.message || "Reject failed");
    }

    console.log("User rejected successfully:", userId);
    return data;
  } catch (error) {
    console.error("rejectAdminUser error:", error);
    throw error;
  }
}

/* ================= DELETE USER ================= */
export async function deleteAdminUser(userId: string) {
  try {
    console.log("Deleting user:", userId);

    const res = await fetch(`${API_BASE_ADMIN}/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned non-JSON response");
    }

    if (!res.ok) {
      console.error("deleteAdminUser failed:", {
        userId,
        status: res.status,
        statusText: res.statusText,
        data,
      });
      throw new Error(data.message || "Delete failed");
    }

    console.log("User deleted successfully:", userId);
    return data;
  } catch (error) {
    console.error("deleteAdminUser error:", error);
    throw error;
  }
}