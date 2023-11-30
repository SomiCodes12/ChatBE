import { Router } from "express"
import { createChat, deleteChat, findUserChats, findOneUserChat, findChats } from "../Controller/chatController";

const router = Router();

router.route("/:userID/:friendID/create-chat").post(createChat)
router.route("/find-chats").get(findChats)
router.route("/:userID/find-chats").get(findUserChats)
router.route("/:userID/:chatID/find-one-user-chat").get(findOneUserChat)
router.route("/:userID/:chatID/delete-chat").delete(deleteChat)

export default router;