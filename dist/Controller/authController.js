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
exports.deleteAccount = exports.unFriend = exports.addFriend = exports.makeRequest = exports.viewOneAccount = exports.viewAccounts = exports.createAccount = void 0;
const client_1 = require("@prisma/client");
const amqplib_1 = __importDefault(require("amqplib"));
const streamifier_1 = require("../Utils/streamifier");
const prisma = new client_1.PrismaClient();
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const { secure_url, public_id } = yield (0, streamifier_1.streamUpload)(req);
        const account = yield prisma.authModel.create({
            data: {
                userName,
                email,
                password,
                friends: [],
                requests: [],
                followers: [],
                following: [],
                image: secure_url,
                imageID: public_id
            },
        });
        // const url: string = "amqps://oqoilczw:***@armadillo.rmq.cloudamqp.com/oqoilczw";
        const url = "amqp://localhost:5672";
        const connect = yield amqplib_1.default.connect(url);
        const channel = yield connect.createChannel();
        yield channel.sendToQueue("createAccount", Buffer.from(JSON.stringify(account)));
        return res.status(201).json({
            message: "Created Account Successfully",
            data: account,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Creating Account",
            data: error.message,
        });
    }
});
exports.createAccount = createAccount;
const viewAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accounts = yield prisma.authModel.findMany({});
        return res.status(200).json({
            message: "Viewed Accounts Successfully",
            data: accounts,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Viewing Account",
            data: error.message,
        });
    }
});
exports.viewAccounts = viewAccounts;
const viewOneAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const account = yield prisma.authModel.findUnique({
            where: {
                id: userID,
            }, include: { groups: true }
        });
        return res.status(200).json({
            message: "Viewed Account Successfully",
            data: account,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Viewing Account",
            data: error.message,
        });
    }
});
exports.viewOneAccount = viewOneAccount;
const makeRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, friendID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: {
                id: userID,
            },
        });
        const friend = yield prisma.authModel.findUnique({
            where: {
                id: friendID,
            },
        });
        const check = yield friend.requests.some((el) => el === userID);
        if (user && friend) {
            if (userID !== friendID) {
                if (!check) {
                    let met = [...friend.requests, userID];
                    const userRequests = yield prisma.authModel.update({
                        where: { id: friendID },
                        data: {
                            requests: met,
                        },
                    });
                    return res.status(201).json({
                        message: "Sent Request Successfully",
                        data: { userRequests },
                    });
                }
                else {
                    return res.status(400).json({
                        message: "You Already Sent a request",
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "You can't send request to yourself",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Account(s) Not Found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Making Request",
            data: error.message,
            error,
        });
    }
});
exports.makeRequest = makeRequest;
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, friendID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: {
                id: userID,
            },
        });
        const friend = yield prisma.authModel.findUnique({
            where: {
                id: friendID,
            },
        });
        const checkRequest = user.requests.some((el) => el === friendID);
        const checkFriends = yield user.friends.some((el) => el === friendID);
        if (user && friend) {
            if (userID !== friendID) {
                if (!checkFriends) {
                    if (checkRequest) {
                        let met = [...user.friends, friendID];
                        let me = [...friend.friends, userID];
                        const userFriends = yield prisma.authModel.update({
                            where: { id: userID },
                            data: {
                                friends: met,
                            },
                        });
                        const friendFriends = yield prisma.authModel.update({
                            where: { id: friendID },
                            data: {
                                friends: me,
                            },
                        });
                        if (userFriends && friendFriends) {
                            const update = user.requests.filter((el) => el !== friendID);
                            const requestUpdate = yield prisma.authModel.update({
                                where: { id: userID },
                                data: {
                                    requests: update,
                                },
                            });
                            return res.status(201).json({
                                message: "Sent Request Successfully",
                                data: { userFriends, friendFriends, requestUpdate },
                            });
                        }
                        else {
                            return res.status(201).json({
                                message: "You've not yet accepted",
                            });
                        }
                    }
                    else {
                        return res.status(400).json({
                            message: "User Not in your request array",
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        message: "You Guys are already Friends",
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "You can't friend yourself",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Account(s) Not Found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Adding Friend",
            data: error.message,
            error,
        });
    }
});
exports.addFriend = addFriend;
const unFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, friendID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: {
                id: userID,
            },
        });
        const friend = yield prisma.authModel.findUnique({
            where: {
                id: friendID,
            },
        });
        if (user && friend) {
            const userFilter = yield prisma.authModel.update({
                where: { id: userID },
                data: {
                    friends: yield user.friends.filter((el) => el !== friendID),
                },
            });
            const friendFilter = yield prisma.authModel.update({
                where: { id: friendID },
                data: {
                    friends: yield friend.friends.filter((el) => el !== userID),
                },
            });
            return res.status(200).json({
                message: "UnFriend Successful",
            });
        }
        else {
            return res.status(404).json({
                message: "Account(s) Not Found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Adding Friend",
            data: error.message,
        });
    }
});
exports.unFriend = unFriend;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const account = yield prisma.authModel.delete({
            where: {
                id: userID,
            },
        });
        return res.status(200).json({
            message: "Deleted Account Successfully",
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Deleting Account",
            data: error.message,
        });
    }
});
exports.deleteAccount = deleteAccount;
