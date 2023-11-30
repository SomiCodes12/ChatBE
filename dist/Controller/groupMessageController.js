"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroupMessage = exports.viewGroupMessage = exports.createGroupMessage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGroupMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, groupID } = req.params;
        const { message } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const group = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        const check = yield (group === null || group === void 0 ? void 0 : group.members.some((el) => el === userID));
        if (check) {
            const create = yield prisma.groupMessageModel.create({
                data: {
                    userID,
                    groupID,
                    message,
                },
            });
            // const userMessage = [...user?.chatMessage, create];
            return res.status(201).json({
                message: "Created Group Message",
                data: create,
            });
        }
        else {
            return res.status(404).json({
                message: "You ain't a member",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Creating Group Message",
            data: error.message,
        });
    }
});
exports.createGroupMessage = createGroupMessage;
const viewGroupMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, groupID } = req.params;
        const group = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        if (group === null || group === void 0 ? void 0 : group.members.some((el) => el === userID)) {
            const view = yield prisma.groupMessageModel.findMany();
            return res.status(200).json({
                message: "Viewed Group Message",
                data: view,
            });
        }
        else {
            return res.status(400).json({
                message: "You ain't a member",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Viewing Group Message",
            data: error.message,
        });
    }
});
exports.viewGroupMessage = viewGroupMessage;
const deleteGroupMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, groupID, messageID } = req.params;
        const group = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        const message = yield prisma.groupMessageModel.findUnique({
            where: { id: messageID },
        });
        const member = yield (group === null || group === void 0 ? void 0 : group.members.some((el) => el === userID));
        if (member) {
            if ((message === null || message === void 0 ? void 0 : message.userID) === userID) {
                const deleted = yield prisma.groupMessageModel.delete({
                    where: { id: messageID },
                });
                return res.status(200).json({
                    message: "Deleted Group Message",
                    data: deleted
                });
            }
            else {
                return res.status(400).json({
                    message: "No be you create this message na guy!!!",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "You ain't a member of this group",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Deleting Group Message",
            data: error.message,
        });
    }
});
exports.deleteGroupMessage = deleteGroupMessage;
