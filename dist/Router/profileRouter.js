"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../Controller/profileController");
const router = (0, express_1.Router)();
router.route("/:userID/create-profile").post(profileController_1.createProfile);
router.route("/:userID/:profileID/update-user-info").patch(profileController_1.updateUserInfo);
exports.default = router;
