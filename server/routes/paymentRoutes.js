import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {
  initiateEsewaPayment,
  handleEsewaSuccess,
  handleEsewaFailure,
} from "../controllers/paymentController.js";

const paymentRouter = Router();

// Admin starts a payment for a given payslip
paymentRouter.post("/esewa/initiate/:payslipId", protect, protectAdmin, initiateEsewaPayment);

// eSewa calls these directly (browser redirect) — no auth, eSewa isn't logged into our app
paymentRouter.get("/esewa/success", handleEsewaSuccess);
paymentRouter.get("/esewa/failure", handleEsewaFailure);

export default paymentRouter;
