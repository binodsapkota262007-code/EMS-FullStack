import User from "../models/User.js";

// Get all users (for admin management page)
// GET /api/users/all
export const getAllUsers = async (req, res) => {
    try {
        const session = req.session;
        if (session.role !== "ADMIN") {
            return res.status(403).json({ error: "Not authorized" });
        }

        const users = await User.find({}, "-password -resetOtp -resetOtpExpiry"); // exclude sensitive fields
        return res.json({ users });

    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
};