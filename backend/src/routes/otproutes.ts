import { Router } from "express";
import { sendOTP, verifyOTP } from "../controllers/otp";

const router = Router();

router.post("/send-otp", sendOTP as any);
router.post("/verify-otp", verifyOTP as any);

export default router;