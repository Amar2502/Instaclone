import { Router } from "express";
import { followUser } from "../controllers/following";

const router = Router();

router.post("/follow-user", followUser as any);

export default router;