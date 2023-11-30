import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotice = async (req: Request, res: Response) => {
  try {
    const { notice } = req.body;
    const noticeCreate = await prisma.notifyModel.create({
      data: {
        notice
      },
    });

    console.log(noticeCreate);
    

    return res.status(201).json({
      message: "Created Notice Successfully",
      data: noticeCreate,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error Creating Notice",
      data: error.message,
      error
    });
  }
};

// export const updateUserInfo = async (req: Request, res: Response) => {
//   try {
//     const { userID ,  profileID } = req.params;
//     const { newUserName , newLocation } = req.body;

//     const profile = await prisma.profileModel.update({
//       where : {id : profileID} , data : {
//         userName : newUserName,
//         location : newLocation
//       }
//     });

//     return res.status(201).json({
//       message: "Updated Profile Successfully",
//       data: profile,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: "Error Updating Profile",
//       data: error.message,
//     });
//   }
// };
