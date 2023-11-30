import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createChat = async (req: Request, res: Response) => {
  try {
    const { userID, friendID }: any = req.params;

    const user: any = await prisma.authModel.findUnique({
      where: {
        id: userID,
      },
      include: {
        chats: true,
      },
    });
    const friend: any = await prisma.authModel.findUnique({
      where: {
        id: friendID,
      },
    });
    // const restrict = await user?.userChats.forEach((el: any) =>
    //   el.members.every((el: any) => el === userID && friendID)
    // );

    if (user && friend) {
      const existing: any = await prisma.chatModel.findFirst({
        where: {
          userID,
          friendID,
        },
      });
      if (!existing) {
        const chat = await prisma.chatModel.create({
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
      } else {
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
    } else {
      return res.status(404).json({
        message: "Users Not Found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error Creating Chat",
      data: error.message,
    });
  }
};

export const findChats = async (req: Request, res: Response) => {
  try {
    const chat = await prisma.chatModel.findMany();

    return res.status(200).json({
      message: "Found Chats Successfuly",
      data: chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Finding Chats",
      data: error.message,
    });
  }
};

export const findUserChats = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user: any = await prisma.authModel.findUnique({
      where: { id: userID },include : {
        chats : true 
      }
    });

    return res.status(200).json({
      message: "Found User Chats Successfuly",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Finding Chats",
      data: error.message,
    });
  }
};

export const findOneUserChat = async (req: Request, res: Response) => {
  try {
    const { userID, chatID } = req.params;

    const user: any = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const chat = user?.userChats.filter((el: any) => {
      return el.id === chatID;
    });

    // console.log(chat);

    return res.status(200).json({
      message: "Found User's Chat Successfuly",
      data: chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Finding Chat",
      data: error.message,
    });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { userID, chatID } = req.params;

    const user: any = await prisma.authModel.findUnique({
      where: {
        id: userID,
      },
    });

    const chat: any = await prisma.chatModel.findUnique({
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
    const checkUser: any = await chat.members.some((el: any) => el === userID);
    console.log(checkUser);

    const checkChat: any = await prisma.chatModel.findUnique({
      where: { id: chatID },
    });

    if (checkChat) {
      if (checkUser) {
        const chatDelete = await prisma.chatModel.delete({
          where: { id: chatID },
        });

        return res.status(200).json({
          message: "Deleted Chat Successfully",
          data: chatDelete,
        });
      } else {
        return res.status(404).json({
          message: "You ain't a member of this chat",
        });
      }
    } else {
      return res.status(400).json({
        message: "Unexisting Chat",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error Deleting Chat",
      data: error.message,
    });
  }
};
