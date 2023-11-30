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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.findChatMessages = exports.createMessage = void 0;
const client_1 = require("@prisma/client");
const amqplib_1 = __importDefault(require("amqplib"));
const prisma = new client_1.PrismaClient();
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, chatID } = req.params;
        const { message } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const chat = yield prisma.chatModel.findUnique({
            where: { id: chatID },
            include: {
                messages: true,
            },
        });
        const userCheck = yield (chat === null || chat === void 0 ? void 0 : chat.members.some((el) => el === userID));
        if (userCheck) {
            const chatMessage = yield prisma.messageModel.create({
                data: {
                    message,
                    userID,
                    chatID,
                },
            });
            const url = "amqp://localhost:5672";
            const connect = yield amqplib_1.default.connect(url);
            const channel = yield connect.createChannel();
            yield channel.sendToQueue("creatingMessage", Buffer.from(JSON.stringify(chatMessage)));
            // const channel = 
            //  const userPush =  [...chat?.messages, chatMessage]
            // //  const friendPush =  [...friend?.userChats , chatMessage]
            //  const userUpdate = await prisma.chatModel.update({where : {id : chatID} , data : {
            //   messages : userPush
            //  }})
            //  console.log(userPush);
            //  const friendUpdate = await prisma.authModel.update({where : {id : friendID} , data : {
            //   userChats : friendPush
            //  }})
            // const newUpdate = [...user?.userChats , userUpdate]
            // const latestUpdate = await prisma.authModel.update({where : {id : userID} , data : {
            //   userChats : newUpdate
            // }})
            // const filtered = user?.userChats.filter((el : any) => el.id === chatID)
            // let pushed = filtered[0].messages.filter((el : any) => {return el})
            // const newPush = [...pushed , chatMessage]
            // console.log(newPush);
            return res.status(201).json({
                message: "Created Message Successfully",
                data: chatMessage,
            });
        }
        else {
            return res.status(400).json({
                message: "You are not a member of this chat",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Creating Message",
            data: error.message,
            error,
        });
    }
});
exports.createMessage = createMessage;
const findChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID } = req.params;
        const chat = yield prisma.chatModel.findUnique({ where: { id: chatID }, include: { messages: true } });
        const check = yield prisma.chatModel.findUnique({ where: { id: chatID } });
        return res.status(201).json({
            message: "Found Messages Successfully",
            data: chat,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Finding Messages",
            data: error.message,
        });
    }
});
exports.findChatMessages = findChatMessages;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatMessage = yield prisma.messageModel.findMany();
        return res.status(201).json({
            message: "Found Messages Successfully",
            data: chatMessage,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Finding Messages",
            data: error.message,
        });
    }
});
exports.deleteMessage = deleteMessage;
