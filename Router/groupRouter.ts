import { Router } from "express"
import { createGroup, deleteGroup, deleteGroupMember, addMember,  viewUserGroup, viewOneGroup } from "../Controller/groupController";

const router = Router();

router.route("/:adminID/create-group").post(createGroup)
router.route("/:adminID/:userID/:groupID/add-member").patch (addMember)
// router.route("/:userID/:groupID/update-group").patch(updateGroup)
router.route("/:userID/view-user-group").get(viewUserGroup)
router.route("/:groupID/view-one-group").get(viewOneGroup)
router.route("/:adminID/:userID/:groupID/delete-group-member").delete(deleteGroupMember)
router.route("/:adminID/:groupID/delete-group").delete(deleteGroup)

export default router;