import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRoutes = Router();

userRoutes.get("/all", protect, getAllUsers);

export default userRoutes;