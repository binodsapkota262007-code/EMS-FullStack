import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ["ADMIN", "EMPLOYEE"], default: "EMPLOYEE"},
    resetOtp: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
    resetOtpVerified: { type: Boolean, default: false },
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;