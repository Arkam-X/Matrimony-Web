import express from "express";
import { browseProfiles } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Only logged-in approved users */
router.get("/browse", protect, browseProfiles);

export default router;
