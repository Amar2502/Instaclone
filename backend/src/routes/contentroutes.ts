import { Router } from "express";
import { getExplore } from "../controllers/explore";

const router = Router();

router.get("/explore/:user_id", getExplore as any);

export default router;