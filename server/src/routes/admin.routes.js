import express from "express";
import {
  getAllUsers,
  getUserById,
  rejectUser,
  deleteUser,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";

import { protectAdmin } from "../middleware/adminAuth.middleware.js";

const router = express.Router();

/* All routes protected by ADMIN auth */
router.use(protectAdmin);

/* User management */
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/reject", rejectUser);
router.delete("/users/:id", deleteUser);

/* Admin management */
router.get("/admins", getAllAdmins);
router.post("/admins", createAdmin);
router.delete("/admins/:id", deleteAdmin);

export default router;
