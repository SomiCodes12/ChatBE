import { Router } from "express"
import { createGroupMessage, viewGroupMessage } from "../Controller/groupMessageController"

const router = Router()

router.route("/:userID/:groupID/create-group-message").post(createGroupMessage)
router.route("/:userID/:groupID/view-group-message").get(viewGroupMessage)

export default router;