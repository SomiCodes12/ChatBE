"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupMessageController_1 = require("../Controller/groupMessageController");
const router = (0, express_1.Router)();
router.route("/:userID/:groupID/create-group-message").post(groupMessageController_1.createGroupMessage);
router.route("/:userID/:groupID/view-group-message").get(groupMessageController_1.viewGroupMessage);
exports.default = router;
