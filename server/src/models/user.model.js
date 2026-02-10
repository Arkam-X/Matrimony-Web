import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* =========================
   Address Sub-Schema
========================= */
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  nativePlace: { type: String, required: true, trim: true },
});

/* =========================
   Guardian Sub-Schema
========================= */
const guardianSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  relation: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
});

/* =========================
   Main User Schema
========================= */
const userSchema = new mongoose.Schema(
  {
    /* ===== Auth Basics ===== */
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔐 never return password in queries
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    /* ===== Personal Details ===== */
    dateOfBirth: { type: Date, required: true },

    maritalStatus: {
      type: String,
      enum: ["NEVER_MARRIED", "MARRIED", "DIVORCED", "WIDOWED"],
      required: true,
    },

    height: { type: String, required: true },
    weight: { type: String, required: true },
    complexion: { type: String, required: true },
    religion: { type: String, required: true },

    education: { type: String, required: true },
    deenEducation: { type: String, required: true },

    workStatus: {
      type: String,
      enum: ["JOB", "BUSINESS", "STUDENT", "UNEMPLOYED"],
      required: true,
    },

    income: { type: String },

    /* ===== Address ===== */
    address: { type: addressSchema, required: true },

    /* ===== Guardians ===== */
    guardian1: { type: guardianSchema, required: true },
    guardian2: { type: guardianSchema },

    /* ===== Profile ===== */
    profileImage: { type: String }, // Cloudinary URL later
    description: { type: String, required: true, trim: true },

    /* ===== Admin Approval System ===== */
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: { type: String },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);


/* =========================
   🔐 Password Hashing
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* =========================
   🔑 Compare Password
========================= */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model("User", userSchema);
