import { Router } from "express";
import { getExplore } from "../controllers/explore";
import { getLatestContent } from "../controllers/content";

const router = Router();

router.get("/explore/:user_id", getExplore as any);
router.post("/get-latest-content", getLatestContent as any);

export default router;