import { Router } from "express";
import { registerUser, loginUser, getUserByUsername } from "../controllers/user";
import isAuthenticated from "../middleware/isAuthenticated";
import { isauth } from "../controllers/auth";

const router = Router();

router.post("/register", registerUser as any);
router.post("/login", loginUser as any);
router.get("/isauth", isAuthenticated, isauth as any);
router.get("/:username", getUserByUsername as any);

export default router;