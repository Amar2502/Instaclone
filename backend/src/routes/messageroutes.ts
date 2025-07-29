import { Router } from "express";
import { sendMessages, getMessages, getPreviousMessagesProfiles } from "../controllers/messages";

const router = Router();

router.post("/send-message", sendMessages as any);
router.get("/get-messages/:sender_id/:receiver_id", getMessages as any);
router.get("/previous-messages-profiles/:user_id", getPreviousMessagesProfiles as any);

export default router;