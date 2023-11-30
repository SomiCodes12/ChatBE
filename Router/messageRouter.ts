import { Router } from "express"
import { createMessage, findChatMessages } from "../Controller/messageController";

const router = Router();

router.route("/:userID/:chatID/create-message").post(createMessage)
router.route("/:chatID/find-chat-messages").get(findChatMessages)

export default router;