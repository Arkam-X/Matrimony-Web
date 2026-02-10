import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateTokens.js";


/* =============================
   REGISTER USER
============================= */
export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      gender,
      dateOfBirth,
      maritalStatus,
      height,
      weight,
      complexion,
      religion,
      education,
      deenEducation,
      workStatus,
      income,
      address,
      guardian1,
      guardian2,
      description,
    } = req.body;

    /* ===== Basic validation ===== */
    if (
      !name ||
      !surname ||
      !email ||
      !password ||
      !gender ||
      !dateOfBirth ||
      !maritalStatus ||
      !height ||
      !weight ||
      !complexion ||
      !religion ||
      !education ||
      !deenEducation ||
      !workStatus ||
      !address ||
      !guardian1 ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* ===== Check existing email ===== */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* ===== Create user ===== */
    const user = await User.create({
      name,
      surname,
      email,
      password,
      gender,
      dateOfBirth,
      maritalStatus,
      height,
      weight,
      complexion,
      religion,
      education,
      deenEducation,
      workStatus,
      income,
      address,
      guardian1,
      guardian2,
      description,
      status: "PENDING", // 👈 important for admin approval
    });

    /* ===== Success response ===== */
    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Your profile will be reviewed within 24–48 hours.",
      data: {
        id: user._id,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =============================
   LOGIN USER
============================= */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /* ===== Validate ===== */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* ===== Find user WITH password ===== */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ===== Check password ===== */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ===== Block if not approved ===== */
    if (user.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message:
          "Your profile is under review. Please wait for admin approval.",
      });
    }

    /* ===== Generate tokens ===== */
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    /* ===== Send refresh token in HTTP-only cookie ===== */
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // ⚠️ true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    /* ===== Send response ===== */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =============================
   REFRESH ACCESS TOKEN
============================= */
export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    /* Verify token */
    const decoded = verifyRefreshToken(token);

    /* Check user still exists */
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    /* Generate new access token */
    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/* =============================
   LOGOUT USER
============================= */
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

