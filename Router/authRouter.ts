import { Router } from "express"
import { addFriend, createAccount, deleteAccount, makeRequest, unFriend, viewAccounts, viewOneAccount } from "../Controller/authController";

const router = Router();

router.route("/create-account").post(createAccount);
router.route("/view-accounts").get(viewAccounts);
router.route("/:userID/view-account").get(viewOneAccount);
router.route("/:userID/:friendID/make-request").patch(makeRequest);
router.route("/:userID/:friendID/add-friend").patch(addFriend);
router.route("/:userID/:friendID/un-friend").patch(unFriend);
router.route("/:userID/delete-account").delete(deleteAccount);

export default router;