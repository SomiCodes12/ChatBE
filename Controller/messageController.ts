import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import amqp from "amqplib"

const prisma = new PrismaClient();

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { userID, chatID } = req.params;
    const { message } = req.body;

    const user: any = await prisma.authModel.findUnique({
      where: { id: userID },
    });
    const chat: any = await prisma.chatModel.findUnique({
      where: { id: chatID },
      include: {
        messages: true,
      },
    });
    const userCheck = await chat?.members.some((el: any) => el === userID);

    if (userCheck) {
      const chatMessage = await prisma.messageModel.create({
        data: {
          message,
          userID,
          chatID,
        },
      });

      const url = "amqp://localhost:5672";
      const connect = await amqp.connect(url);
      const channel = await connect.createChannel();

      await channel.sendToQueue("creatingMessage", Buffer.from(JSON.stringify(chatMessage)))
      
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
    } else {
      return res.status(400).json({
        message: "You are not a member of this chat",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error Creating Message",
      data: error.message,
      error,
    });
  }
};

export const findChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatID } = req.params;
    const chat = await prisma.chatModel.findUnique({ where: { id: chatID } , include : {messages : true} });

    const check = await prisma.chatModel.findUnique({ where: { id: chatID } });

    return res.status(201).json({
      message: "Found Messages Successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Finding Messages",
      data: error.message,
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const chatMessage = await prisma.messageModel.findMany();

    return res.status(201).json({
      message: "Found Messages Successfully",
      data: chatMessage,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Finding Messages",
      data: error.message,
    });
  }
};
