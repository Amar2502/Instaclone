import { Router } from "express";
import { sendMessages, getMessages } from "../controllers/messages";

const router = Router();

router.post("/send-message", sendMessages as any);
router.get("/get-messages/:sender_id/:receiver_id", getMessages as any);

export default router;