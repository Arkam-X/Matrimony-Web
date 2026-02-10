import dotenv from "dotenv";

// 1️⃣ Load env FIRST
dotenv.config();
// 2️⃣ Then import things that use env
import app from "./app.js";
import connectDB from "./config/db.js";

// 3️⃣ Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// 4️⃣ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
