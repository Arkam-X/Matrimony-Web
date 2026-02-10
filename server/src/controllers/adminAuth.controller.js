import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
/* Generate Admin JWT */
const generateAdminToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: "1d",
  });
};

/* =============================
   ADMIN LOGIN
============================= */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("EMAIL FROM BODY:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    console.log("ADMIN FOUND:", admin);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // const isMatch = await admin.comparePassword(password);
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("DIRECT BCRYPT MATCH:", isMatch);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateAdminToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
};
