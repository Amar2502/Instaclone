import { Router } from "express";
import { registerUser, loginUser, getUserByUsername, getSomeAccounts } from "../controllers/user";
import isAuthenticated from "../middleware/isAuthenticated";
import { isauth } from "../controllers/auth";
import upload from "../middleware/file";
import { setProfile } from "../controllers/profile";
import { searchUserbyLetters } from "../controllers/user_search";

const router = Router();

router.post("/register", registerUser as any);
router.post("/login", loginUser as any);
router.get("/isauth", isAuthenticated, isauth as any);
router.get("/search/:query", searchUserbyLetters as any);
router.get("/:username", getUserByUsername as any);
router.get("/get-some-accounts/:username", getSomeAccounts as any);
router.post("/upload-profile-picture", upload.single('file'), setProfile as any);


export default router;