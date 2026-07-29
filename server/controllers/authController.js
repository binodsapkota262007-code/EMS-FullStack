import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import sendEmail from "../config/nodemailer.js";

// Login for employee and admin
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        let {email, password, role_type} = req.body;
        role_type = role_type?.toString().trim().toLowerCase();

        if(!email || !password){
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({email})

        if(!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if(role_type === "admin" && user.role !== "ADMIN"){
            return res.status(401).json({ error: "Not authorized as admin" });
        }

        if(role_type === "employee" && user.role !== "EMPLOYEE"){
            return res.status(401).json({ error: "Not authorized as employee" });
        }

        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid){
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});

        return res.json({ user: payload, token });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Login failed" });
    }
}

// Get session for employee and admin
// GET /api/auth/session
export const session = (req, res)=>{
    const session = req.session;
    return res.json({user: session})
}

// Change password for employee and admin
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;
        if(!currentPassword || !newPassword){
            return res.status(400).json({ error: "Both passwords are required" });
        }
        const user = await User.findById(session.userId)
        if(!user) return res.status(404).json({ error: "User not found" });

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if(!isValid) return res.status(400).json({ error: "Current password is incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, {password: hashed})
        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({ error: "Failed to change password" });
    }
}

// Request an OTP to reset password
// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email });

        // Don't reveal whether the email exists
        if (!user) {
            return res.json({ message: "If that email exists, an OTP has been sent." });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetOtp = hashedOtp;
        user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        user.resetOtpVerified = false;
        await user.save();

        await sendEmail({
            to: user.email,
            subject: "Your password reset code",
            body: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        });

        return res.json({ message: "If that email exists, an OTP has been sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
    }
};

// Verify the OTP
// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        if (user.resetOtpExpiry < new Date()) {
            return res.status(400).json({ error: "OTP has expired" });
        }

        const isValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        user.resetOtpVerified = true;
        await user.save();

        return res.json({ message: "OTP verified" });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ error: "Failed to verify OTP" });
    }
};

// Reset password after OTP verification
// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetOtpVerified) {
            return res.status(400).json({ error: "OTP not verified" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        user.resetOtpVerified = false;
        await user.save();

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ error: "Failed to reset password" });
    }
};