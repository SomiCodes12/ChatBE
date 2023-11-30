import { Router } from "express"
import { createProfile, updateUserInfo } from "../Controller/profileController";


const router = Router()

router.route("/:userID/create-profile").post(createProfile)
router.route("/:userID/:profileID/update-user-info").patch(updateUserInfo)

export default router;