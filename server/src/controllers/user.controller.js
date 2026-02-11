import User from "../models/user.model.js";

/* =============================
   BROWSE PROFILES
============================= */
export const browseProfiles = async (req, res) => {
  try {
    const currentUser = req.user;

    /* Opposite gender logic */
    const oppositeGender = currentUser.gender === "MALE" ? "FEMALE" : "MALE";

    /* Base query → ONLY approved opposite gender */
    const query = {
      gender: oppositeGender,
      status: "APPROVED",
      _id: { $ne: currentUser._id }, // exclude self
    };

    /* ===== Optional Filters ===== */

    // City
    if (req.query.city) {
      query["address.city"] = req.query.city;
    }

    // Religion
    if (req.query.religion) {
      query.religion = req.query.religion;
    }

    // Work Status
    if (req.query.workStatus) {
      query.workStatus = req.query.workStatus;
    }

    // Marital Status
    if (req.query.maritalStatus) {
      query.maritalStatus = req.query.maritalStatus;
    }

    // Education
    if (req.query.education) {
      query.education = req.query.education;
    }

    // Deeni Education
    if (req.query.deenEducation) {
      query.deenEducation = req.query.deenEducation;
    }

    // Age Range → convert to DOB range
    if (req.query.ageMin || req.query.ageMax) {
      const today = new Date();

      const ageQuery = {};

      if (req.query.ageMin) {
        const maxDOB = new Date(
          today.getFullYear() - req.query.ageMin,
          today.getMonth(),
          today.getDate()
        );
        ageQuery.$lte = maxDOB;
      }

      if (req.query.ageMax) {
        const minDOB = new Date(
          today.getFullYear() - req.query.ageMax - 1,
          today.getMonth(),
          today.getDate()
        );
        ageQuery.$gte = minDOB;
      }

      query.dateOfBirth = ageQuery;
    }

    /* ===== Fetch profiles ===== */
    const profiles = await User.find(query).select("-password");

    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("BROWSE PROFILES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profiles",
    });
  }
};