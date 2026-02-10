import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/admin.model.js";

dotenv.config(); // ⭐ VERY IMPORTANT

const seedAdmin = async () => {
  try {
    console.log("MONGO_URI USED:", process.env.MONGO_URI); // debug

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: "admin@test.com" });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    console.log("HASH CREATED:", hashedPassword); // debug

    await Admin.create({
      name: "Super Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
