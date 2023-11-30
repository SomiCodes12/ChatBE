import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGroupMessage = async (req: Request, res: Response) => {
  try {
    const { userID, groupID } = req.params;
    const { message } = req.body;

    const user: any = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const group: any = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });

    const check = await group?.members.some((el: any) => el === userID);

    if (check) {
      const create = await prisma.groupMessageModel.create({
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
    } else {
      return res.status(404).json({
        message: "You ain't a member",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error Creating Group Message",
      data: error.message,
    });
  }
};

export const viewGroupMessage = async (req: Request, res: Response) => {
  try {
    const { userID, groupID } = req.params;

    const group: any = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });

    if (group?.members.some((el: any) => el === userID)) {
      const view = await prisma.groupMessageModel.findMany();

      return res.status(200).json({
        message: "Viewed Group Message",
        data: view,
      });
    } else {
      return res.status(400).json({
        message: "You ain't a member",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error Viewing Group Message",
      data: error.message,
    });
  }
};

export const deleteGroupMessage = async (req: Request, res: Response) => {
  try {
    const { userID, groupID, messageID } = req.params;

    const group: any = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });
    const message = await prisma.groupMessageModel.findUnique({
      where: { id: messageID },
    });

    const member = await group?.members.some((el: any) => el === userID);

    if (member) {
      if (message?.userID === userID) {
        const deleted = await prisma.groupMessageModel.delete({
          where: { id: messageID },
        });

        return res.status(200).json({
          message: "Deleted Group Message",
          data : deleted
        });
      } else {
        return res.status(400).json({
          message: "No be you create this message na guy!!!",
        });
      }
    } else {
      return res.status(400).json({
        message: "You ain't a member of this group",
      });
    }

  } catch (error) {
    return res.status(400).json({
      message: "Error Deleting Group Message",
      data: error.message,
    });
  }
};
