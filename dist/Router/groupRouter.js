"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupController_1 = require("../Controller/groupController");
const router = (0, express_1.Router)();
router.route("/:adminID/create-group").post(groupController_1.createGroup);
router.route("/:adminID/:userID/:groupID/add-member").patch(groupController_1.addMember);
// router.route("/:userID/:groupID/update-group").patch(updateGroup)
router.route("/:userID/view-user-group").get(groupController_1.viewUserGroup);
router.route("/:groupID/view-one-group").get(groupController_1.viewOneGroup);
router.route("/:adminID/:userID/:groupID/delete-group-member").delete(groupController_1.deleteGroupMember);
router.route("/:adminID/:groupID/delete-group").delete(groupController_1.deleteGroup);
exports.default = router;
