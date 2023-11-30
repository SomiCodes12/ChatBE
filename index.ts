import express, { Application, Request, Response } from "express";
import { mainApp } from "./mainApp";
import { Server, Socket } from "socket.io";
import http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import amqplib from "amqplib";
import cors from "cors";

const port: number = 1122;
const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mainApp(app);
server.listen(port, () => {
  console.log();
});

io.on(
  "connection",
  async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    console.log(socket.id);

    const url: string = "amqp://localhost:5672";
    const data : any = [];

    const connect = await amqplib.connect(url);
    const channel = await connect.createChannel();

    await channel.assertQueue("createAccount");
    await channel.consume("createAccount", async (res: any) => {
      console.log(res);
      await data.push(await JSON.parse(res?.content.toString()));
      console.log(data.length);
      // console.log(data)
      socket.emit("firstio" , await data);

      await channel.ack(res)
    })
  }
);

process.on("uncaughtException", (error: any) => {
  console.log(`Server is shutting down due to uncaughtException : `, error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log(`Server is shutting down due to unhandledRejection : `, reason);
  server.close(() => {
    process.exit(1);
  });
});
