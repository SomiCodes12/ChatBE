import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProfile = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    
    const { userName, location, dateOfBirth , image  } = req.body;

    const profile = await prisma.profileModel.create({
      data: {
        userName,
        location,
        dateOfBirth,
        user : userName,
        image,
        coverPhoto: " "
      },
    });

    return res.status(201).json({
      message: "Created Profile Successfully",
      data: profile,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Error Creating Profile",
      data: error.message,
    });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userID ,  profileID } = req.params;
    const { newUserName , newLocation } = req.body;

    const profile = await prisma.profileModel.update({
      where : {id : profileID} , data : {
        userName : newUserName,
        location : newLocation
      }
    });
 
    return res.status(201).json({
      message: "Updated Profile Successfully",
      data: profile,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Error Updating Profile",
      data: error.message,
    });
  }
};
