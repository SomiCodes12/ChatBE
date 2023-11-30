import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import amqplib from "amqplib";

const prisma = new PrismaClient();

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    const account = await prisma.authModel.create({
      data: {
        userName,
        email,
        password,
        friends: [],
        requests: [],
        followers: [],
        following: [],
      },
    });

    const url: string = "amqp://localhost:5672";
    const connect = await amqplib.connect(url);
    const channel = await connect.createChannel();

    await channel.sendToQueue(
      "createAccount",
      Buffer.from(JSON.stringify(account))
    );

    return res.status(201).json({
      message: "Created Account Successfully",
      data: account,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Creating Account",
      data: error.message,
    });
  }
};

export const viewAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await prisma.authModel.findMany({});

    return res.status(200).json({
      message: "Viewed Accounts Successfully",
      data: accounts,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error Viewing Account",
      data: error.message,
    });
  }
};

export const viewOneAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const account = await prisma.authModel.findUnique({
      where: {
        id: userID,
      }, include : {groups : true}
    });

    return res.status(200).json({
      message: "Viewed Account Successfully",
      data: account,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error Viewing Account",
      data: error.message,
    });
  }
};

export const makeRequest = async (req: Request, res: Response) => {
  try {
    const { userID, friendID } = req.params;
    const user: any = await prisma.authModel.findUnique({
      where: {
        id: userID,
      },
    });
    const friend: any = await prisma.authModel.findUnique({
      where: {
        id: friendID,
      },
    });

    const check = await friend.requests.some((el: any) => el === userID);

    if (user && friend) {
      if (userID !== friendID) {
        if (!check) {
          let met = [...friend.requests, userID];

          const userRequests = await prisma.authModel.update({
            where: { id: friendID },
            data: {
              requests: met,
            },
          });

          return res.status(201).json({
            message: "Sent Request Successfully",
            data: { userRequests },
          });
        } else {
          return res.status(400).json({
            message: "You Already Sent a request",
          });
        }
      } else {
        return res.status(400).json({
          message: "You can't send request to yourself",
        });
      }
    } else {
      return res.status(404).json({
        message: "Account(s) Not Found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error Making Request",
      data: error.message,
      error,
    });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    const { userID, friendID } = req.params;
    const user: any = await prisma.authModel.findUnique({
      where: {
        id: userID,
      },
    });

    const friend: any = await prisma.authModel.findUnique({
      where: {
        id: friendID,
      },
    });

    const checkRequest = user.requests.some((el: any) => el === friendID);
    const checkFriends = await user.friends.some((el: any) => el === friendID);

    if (user && friend) {
      if (userID !== friendID) {
        if (!checkFriends) {
          if (checkRequest) {
            let met = [...user.friends, friendID];
            let me = [...friend.friends, userID];

            const userFriends = await prisma.authModel.update({
              where: { id: userID },
              data: {
                friends: met,
              },
            });

            const friendFriends = await prisma.authModel.update({
              where: { id: friendID },
              data: {
                friends: me,
              },
            });

            if (userFriends && friendFriends) {
              const update = user.requests.filter((el: any) => el !== friendID);

              const requestUpdate = await prisma.authModel.update({
                where: { id: userID },
                data: {
                  requests: update,
                },
              });

              return res.status(201).json({
                message: "Sent Request Successfully",
                data: { userFriends, friendFriends, requestUpdate },
              });
            } else {
              return res.status(201).json({
                message: "You've not yet accepted",
              });
            }
          } else {
            return res.status(400).json({
              message: "User Not in your request array",
            });
          }
        } else {
          return res.status(400).json({
            message: "You Guys are already Friends",
          });
        }
      } else {
        return res.status(400).json({
          message: "You can't friend yourself",
        });
      }
    } else {
      return res.status(404).json({
        message: "Account(s) Not Found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Error Adding Friend",
      data: error.message,
      error,
    });
  }
};

export const unFriend = async (req: Request, res: Response) => {
  try {
    const { userID, friendID } = req.params;
    const user: any = await prisma.authModel.findUnique({
      where: {
        id: userID,
      },
    });
    const friend: any = await prisma.authModel.findUnique({
      where: {
        id: friendID,
      },
    });

    if (user && friend) {
      const userFilter = await prisma.authModel.update({
        where: { id: userID },
        data: {
          friends: await user.friends.filter((el: any) => el !== friendID),
        },
      });

      const friendFilter = await prisma.authModel.update({
        where: { id: friendID },
        data: {
          friends: await friend.friends.filter((el: any) => el !== userID),
        },
      });

      return res.status(200).json({
        message: "UnFriend Successful",
      });
    } else {
      return res.status(404).json({
        message: "Account(s) Not Found",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error Adding Friend",
      data: error.message,
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const account = await prisma.authModel.delete({
      where: {
        id: userID,
      },
    });

    return res.status(200).json({
      message: "Deleted Account Successfully",
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error Deleting Account",
      data: error.message,
    });
  }
};
