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
exports.deleteChat = exports.findOneUserChat = exports.findUserChats = exports.findChats = exports.createChat = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, friendID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: {
                id: userID,
            },
            include: {
                chats: true,
            },
        });
        const friend = yield prisma.authModel.findUnique({
            where: {
                id: friendID,
            },
        });
        // const restrict = await user?.userChats.forEach((el: any) =>
        //   el.members.every((el: any) => el === userID && friendID)
        // );
        if (user && friend) {
            const existing = yield prisma.chatModel.findFirst({
                where: {
                    userID,
                    friendID,
                },
            });
            if (!existing) {
                const chat = yield prisma.chatModel.create({
                    data: {
                        members: [userID, friendID],
                        userID,
                        friendID,
                    },
                });
                return res.status(200).json({
                    message: "Created Chat Successfully",
                    data: chat,
                });
            }
            else {
                return res.status(400).json({
                    message: "Error",
                });
            }
            // const userChats = [...user.userChats, chat];
            // const friendChats = [...friend.userChats, chat];
            // const userUpdate = await prisma.authModel.update({
            //   where: { id: userID },
            //   data: {
            //     userChats: userChats,
            //   },
            // });
            // const friendUpdate = await prisma.authModel.update({
            //   where: { id: friendID },
            //   data: {
            //     userChats: friendChats,
            //   },
            // });
            // } else {
            //   return res.status(200).json({
            //     message: "You have an existing chat with this user",
            //   });
            // }
        }
        else {
            return res.status(404).json({
                message: "Users Not Found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Creating Chat",
            data: error.message,
        });
    }
});
exports.createChat = createChat;
const findChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield prisma.chatModel.findMany();
        return res.status(200).json({
            message: "Found Chats Successfuly",
            data: chat,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Finding Chats",
            data: error.message,
        });
    }
});
exports.findChats = findChats;
const findUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID }, include: {
                chats: true
            }
        });
        return res.status(200).json({
            message: "Found User Chats Successfuly",
            data: user,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Finding Chats",
            data: error.message,
        });
    }
});
exports.findUserChats = findUserChats;
const findOneUserChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, chatID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const chat = user === null || user === void 0 ? void 0 : user.userChats.filter((el) => {
            return el.id === chatID;
        });
        // console.log(chat);
        return res.status(200).json({
            message: "Found User's Chat Successfuly",
            data: chat,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Finding Chat",
            data: error.message,
        });
    }
});
exports.findOneUserChat = findOneUserChat;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, chatID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: {
                id: userID,
            },
        });
        const chat = yield prisma.chatModel.findUnique({
            where: {
                id: chatID,
            },
        });
        // const update = user?.userChats.filter((el: any) => el !== chatID);
        // const userChatUpdate = await prisma.authModel.update({
        //   where: { id: userID },
        //   data: {
        //     userChats: update,
        //   },
        // });
        const checkUser = yield chat.members.some((el) => el === userID);
        console.log(checkUser);
        const checkChat = yield prisma.chatModel.findUnique({
            where: { id: chatID },
        });
        if (checkChat) {
            if (checkUser) {
                const chatDelete = yield prisma.chatModel.delete({
                    where: { id: chatID },
                });
                return res.status(200).json({
                    message: "Deleted Chat Successfully",
                    data: chatDelete,
                });
            }
            else {
                return res.status(404).json({
                    message: "You ain't a member of this chat",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Unexisting Chat",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Deleting Chat",
            data: error.message,
        });
    }
});
exports.deleteChat = deleteChat;
