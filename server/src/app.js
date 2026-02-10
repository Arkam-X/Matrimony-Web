import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";

const app = express();

/* Security */
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

/* Body parsing */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Cookies middleware ⭐ IMPORTANT */
app.use(cookieParser());

/* Logger */
app.use(morgan("dev"));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

export default app;
