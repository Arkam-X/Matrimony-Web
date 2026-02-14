import express from "express";
import {
  getAllUsers,
  getUserById,
  rejectUser,
  deleteUser,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  getDashboardStats,
  approveUser
} from "../controllers/admin.controller.js";

import { protectAdmin } from "../middleware/adminAuth.middleware.js";

const router = express.Router();

/* All routes protected by ADMIN auth */
router.use(protectAdmin);

/* User management */
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/approve", approveUser)
router.patch("/users/:id/reject", rejectUser);
router.delete("/users/:id", deleteUser);

/* Admin Dashboard */
router.get("/dashboard-stats", getDashboardStats);

/* Admin management */
router.get("/admins", getAllAdmins);
router.post("/admins", createAdmin);
router.delete("/admins/:id", deleteAdmin);
router.patch("/users/:id/approve", approveUser);


export default router;
