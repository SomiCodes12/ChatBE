"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../Controller/messageController");
const router = (0, express_1.Router)();
router.route("/:userID/:chatID/create-message").post(messageController_1.createMessage);
router.route("/:chatID/find-chat-messages").get(messageController_1.findChatMessages);
exports.default = router;
