import { Router } from "express";
import { followUser, getFollowers, getFollowings } from "../controllers/following";

const router = Router();

router.post("/follow-user", followUser as any);
router.get("/get-followers/:user_id", getFollowers as any);
router.get("/get-followings/:user_id", getFollowings as any);

export default router;