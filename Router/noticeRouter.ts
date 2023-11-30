import { Router } from "express"
import { createNotice } from "../Controller/notifyController";


const router = Router()

router.route("/create-notice").post(createNotice)


export default router;