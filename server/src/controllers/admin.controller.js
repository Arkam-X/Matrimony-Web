import User from "../models/user.model.js";

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
    const admins = await User.find({ role: "ADMIN" }).select(
      "name email createdAt"
    );

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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Prevent duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const admin = await User.create({
      name,
      email,
      password,
      gender: "MALE", // placeholder (not used for admins)
      dateOfBirth: new Date(),
      maritalStatus: "NEVER_MARRIED",
      height: "N/A",
      weight: "N/A",
      complexion: "N/A",
      religion: "N/A",
      education: "N/A",
      deenEducation: "N/A",
      workStatus: "JOB",
      address: {
        street: "N/A",
        city: "N/A",
        pincode: "000000",
        nativePlace: "N/A",
      },
      guardian1: {
        name: "N/A",
        relation: "N/A",
        mobile: "0000000000",
      },
      description: "System Admin",
      role: "ADMIN",
      status: "APPROVED",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
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
    if (adminId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    // Ensure at least one admin remains
    const adminCount = await User.countDocuments({ role: "ADMIN" });

    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: "At least one admin must remain in the system",
      });
    }

    const deleted = await User.findOneAndDelete({
      _id: adminId,
      role: "ADMIN",
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

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
