import { Router } from "express";
import { registerUser } from "../controllers/user";

const router = Router();

router.post("/register", registerUser as any);

export default router;