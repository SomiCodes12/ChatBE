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
const express_1 = __importDefault(require("express"));
const mainApp_1 = require("./mainApp");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const amqplib_1 = __importDefault(require("amqplib"));
const cors_1 = __importDefault(require("cors"));
const port = 1122;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, mainApp_1.mainApp)(app);
server.listen(port, () => {
    console.log();
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(socket.id);
    const url = "	amqps://oqoilczw:***@armadillo.rmq.cloudamqp.com/oqoilczw";
    const data = [];
    const connect = yield amqplib_1.default.connect(url);
    const channel = yield connect.createChannel();
    yield channel.assertQueue("createAccount");
    yield channel.consume("createAccount", (res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(res);
        yield data.push(yield JSON.parse(res === null || res === void 0 ? void 0 : res.content.toString()));
        console.log(data.length);
        // console.log(data)
        socket.emit("firstio", yield data);
        yield channel.ack(res);
    }));
}));
process.on("uncaughtException", (error) => {
    console.log(`Server is shutting down due to uncaughtException : `, error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log(`Server is shutting down due to unhandledRejection : `, reason);
    server.close(() => {
        process.exit(1);
    });
});
