"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifyController_1 = require("../Controller/notifyController");
const router = (0, express_1.Router)();
router.route("/create-notice").post(notifyController_1.createNotice);
exports.default = router;
