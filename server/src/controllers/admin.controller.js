import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

/* =============================
   GET ALL USERS (for table)
============================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name surname email gender address.city status"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/* =============================
   GET SINGLE USER PROFILE
============================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

/* =============================
   APPROVE USER
============================= */
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "APPROVED" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    console.error("APPROVE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve user",
    });
  }
};

/* =============================
   REJECT USER
============================= */
export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        rejectionReason: reason || "Rejected by admin",
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User rejected successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject user",
    });
  }
};

/* =============================
   DASHBOARD STATS
============================= */
export const getDashboardStats = async (req, res) => {
  try {
    /* ===== User Counts ===== */
    const totalUsers = await User.countDocuments();

    const pendingUsers = await User.countDocuments({ status: "PENDING" });
    const approvedUsers = await User.countDocuments({ status: "APPROVED" });
    const rejectedUsers = await User.countDocuments({ status: "REJECTED" });

    /* ===== Admin Count ===== */
    const totalAdmins = await Admin.countDocuments();

    /* ===== Response ===== */
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        rejectedUsers,
        totalAdmins,
      },
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

/* =============================
   DELETE USER
============================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

/* =============================
   GET ALL ADMINS
============================= */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("name email role createdAt");

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

/* =============================
   CREATE NEW ADMIN
============================= */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existing = await Admin.findOne({ email });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password, // hashed automatically by pre-save hook
      role: role || "MODERATOR",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};


/* =============================
   DELETE ADMIN
============================= */
export const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Prevent self-delete
    if (adminId === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Ensure at least one SUPER_ADMIN remains
    const superAdminCount = await Admin.countDocuments({
      role: "SUPER_ADMIN",
    });

    const target = await Admin.findById(adminId);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (target.role === "SUPER_ADMIN" && superAdminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: "At least one SUPER_ADMIN must remain",
      });
    }

    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};
