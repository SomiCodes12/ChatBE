import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { adminID } = req.params;

    const check: any = await prisma.authModel.findUnique({
      where: { id: adminID },
    });

    if (check) {
      const group = await prisma.groupModel.create({
        data: {
          members: [adminID],
          adminID,
          userID: adminID,
        },
      });

      return res.status(201).json({
        message: "Created Group Successfully",
        data: group,
      });
    } else {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "Error Creating Group",
      data: error.message,
      error,
    });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { adminID, userID, groupID } = req.params;

    const admin: any = await prisma.authModel.findUnique({
      where: { id: userID },
    });
    const user: any = await prisma.authModel.findUnique({
      where: { id: userID },
    });
    const group: any = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });
    const existing = await group.members.some((el: any) => el === userID);
    if (admin && user && group) {
      if (adminID === group.adminID) {
        if (!existing) {
          let members = [...group.members, userID];
          // let userGroups = [...user?.groups, groupID];
          // console.log(userGroups);

          const update = await prisma.groupModel.update({
            where: {
              id: groupID,
            },
            data: {
              members: members,
            },
          });
         
          // user?.groups.push(groupID)
          // user.save()

          return res.status(200).json({
            message: "Added Member Successfully",
            data: update,
          });
        } else {
          return res.status(400).json({
            message: "Already a member",
          });
        }
      } else {
      }
    } else {
      return res.status(400).json({
        message: "User Not Found",
      });
    }
  } catch (error : any) {
    return res.status(400).json({
      message: "Error Adding Member",
      data: error.message,
      error
    });
  }
};

export const deleteGroupMember = async (req: Request, res: Response) => {
  try {
    const { adminID, userID, groupID } = req.params;

    const user: any = await prisma.authModel.findUnique({
      where: { id: adminID },
    });

    const admin: any = await prisma.authModel.findUnique({
      where: { id: adminID },
    });
    const group: any = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });

    if (user && admin && group) {
      if (adminID === group.adminID) {
        const updated = await group.members.filter(
          (el: string) => el !== userID
        );

        const update = await prisma.groupModel.update({
          where: {
            id: groupID,
          },
          data: {
            members: updated,
          },
        });

        return res.status(200).json({
          message: "Deleted Group Member Successfully",
          data: update,
        });
      } else {
        return res.status(404).json({
          message: "You ain't permitted to do this",
        });
      }
    } else {
      return res.status(400).json({
        message: "User Not Found",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "Error Deleting Group Member",
      data: error.message,
    });
  }
};

export const viewUserGroup = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user: any = await prisma.authModel.findUnique({
      where: { id: userID },
      include: {
        groups: true,
      },
    });

    return res.status(200).json({
      message: "Viewed Group Successfully",
      data: user,
    });
  } catch (error:any) {
    return res.status(400).json({
      message: "Error Joining Group",
      data: error.message,
    });
  }
};

export const viewOneGroup = async (req: Request, res: Response) => {
  try {
    const { groupID } = req.params;

    const viewed = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });

    return res.status(200).json({
      message: "Viewed Group Successfully",
      data: viewed,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Error Joining Group",
      data: error.message,
    });
  }
};

// export const updateGroup = async (req: Request, res: Response) => {
//   try {
//     const { userID, groupID } = req.params;

//     const adminCheck = await prisma.authModel.findUnique({
//       where: { id: userID },
//     });

//     const groupCheck: any = await prisma.groupModel.findUnique({
//       where: { id: groupID },
//     });
//     const memberCheck = await groupCheck.members.some(
//       (el: any) => el === userID
//     );

//     if (adminCheck) {
//       if (memberCheck) {
//         const update: any = await prisma.groupModel.update({
//           where: { id: groupID },
//           data: {
//             adminID: userID,
//           },
//         });

//         return res.status(200).json({
//           message: "Updated Group Successfully",
//           data: update,
//         });
//       } else {
//         return res.status(400).json({
//           message: "You ain't a member of this group",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         message: "User Not Found",
//       });
//     }
//   } catch (error) {
//     return res.status(400).json({
//       message: "Error Joining Group",
//       data: error.message,
//     });
//   }
// };

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { adminID, groupID } = req.params;
    const admin = await prisma.authModel.findUnique({ where: { id: adminID } });
    const group = await prisma.groupModel.findUnique({
      where: { id: groupID },
    });

    if (adminID === group?.adminID) {
      const deleteGroup = await prisma.groupModel.delete({
        where: { id: groupID },
      });

      return res.status(200).json({
        message: "Deleted Group Successfully",
        data: deleteGroup,
      });
    } else {
      return res.status(400).json({
        message: "You ain't authorised to do this",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "Error Deleting Group",
      data: error.message,
    });
  }
};
