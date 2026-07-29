import {Router} from "express";
import {
  changePassword,
  login,
  session,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRoutes = Router();

authRoutes.post("/login", login)
authRoutes.get("/session", protect, session)
authRoutes.post("/change-password", protect, changePassword)
authRoutes.post("/forgot-password", forgotPassword)
authRoutes.post("/verify-otp", verifyOtp)
authRoutes.post("/reset-password", resetPassword)

export default authRoutes;