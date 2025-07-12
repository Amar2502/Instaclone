import { Router } from "express";
import { getPosts, setPost } from "../controllers/posts";
import upload from "../middleware/file";

const router = Router();

router.post("/set-post", upload.single("file"), setPost as any);
router.get("/get-posts/:user_id", getPosts as any);

export default router;