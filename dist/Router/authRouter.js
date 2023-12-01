"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../Controller/authController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const myUpload = (0, multer_1.default)().single("image");
router.route("/create-account").post(myUpload, authController_1.createAccount);
router.route("/sign-in-account").post(authController_1.signInAccount);
router.route("/view-accounts").get(authController_1.viewAccounts);
router.route("/:userID/view-account").get(authController_1.viewOneAccount);
router.route("/:userID/:friendID/make-request").patch(authController_1.makeRequest);
router.route("/:userID/:friendID/add-friend").patch(authController_1.addFriend);
router.route("/:userID/:friendID/un-friend").patch(authController_1.unFriend);
router.route("/:userID/delete-account").delete(authController_1.deleteAccount);
exports.default = router;
