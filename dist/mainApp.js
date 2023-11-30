"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./Router/authRouter"));
const chatRouter_1 = __importDefault(require("./Router/chatRouter"));
const messageRouter_1 = __importDefault(require("./Router/messageRouter"));
const groupRouter_1 = __importDefault(require("./Router/groupRouter"));
const groupMessageRouter_1 = __importDefault(require("./Router/groupMessageRouter"));
const noticeRouter_1 = __importDefault(require("./Router/noticeRouter"));
const profileRouter_1 = __importDefault(require("./Router/profileRouter"));
const mainApp = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use("/api/v1", authRouter_1.default);
    app.use("/api/v1", chatRouter_1.default);
    app.use("/api/v1", messageRouter_1.default);
    app.use("/api/v1", groupRouter_1.default);
    app.use("/api/v1", groupMessageRouter_1.default);
    app.use("/api/v1", profileRouter_1.default);
    app.use("/api/v1", noticeRouter_1.default);
};
exports.mainApp = mainApp;
