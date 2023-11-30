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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.viewOneGroup = exports.viewUserGroup = exports.deleteGroupMember = exports.addMember = exports.createGroup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const check = yield prisma.authModel.findUnique({
            where: { id: adminID },
        });
        if (check) {
            const group = yield prisma.groupModel.create({
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
        }
        else {
            return res.status(404).json({
                message: "User Not Found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Creating Group",
            data: error.message,
            error,
        });
    }
});
exports.createGroup = createGroup;
const addMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID, userID, groupID } = req.params;
        const admin = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const group = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        const existing = yield group.members.some((el) => el === userID);
        if (admin && user && group) {
            if (adminID === group.adminID) {
                if (!existing) {
                    let members = [...group.members, userID];
                    // let userGroups = [...user?.groups, groupID];
                    // console.log(userGroups);
                    const update = yield prisma.groupModel.update({
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
                }
                else {
                    return res.status(400).json({
                        message: "Already a member",
                    });
                }
            }
            else {
            }
        }
        else {
            return res.status(400).json({
                message: "User Not Found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Adding Member",
            data: error.message,
            error
        });
    }
});
exports.addMember = addMember;
const deleteGroupMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID, userID, groupID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: adminID },
        });
        const admin = yield prisma.authModel.findUnique({
            where: { id: adminID },
        });
        const group = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        if (user && admin && group) {
            if (adminID === group.adminID) {
                const updated = yield group.members.filter((el) => el !== userID);
                const update = yield prisma.groupModel.update({
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
            }
            else {
                return res.status(404).json({
                    message: "You ain't permitted to do this",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "User Not Found",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Deleting Group Member",
            data: error.message,
        });
    }
});
exports.deleteGroupMember = deleteGroupMember;
const viewUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
            include: {
                groups: true,
            },
        });
        return res.status(200).json({
            message: "Viewed Group Successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Joining Group",
            data: error.message,
        });
    }
});
exports.viewUserGroup = viewUserGroup;
const viewOneGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupID } = req.params;
        const viewed = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        return res.status(200).json({
            message: "Viewed Group Successfully",
            data: viewed,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Joining Group",
            data: error.message,
        });
    }
});
exports.viewOneGroup = viewOneGroup;
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
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID, groupID } = req.params;
        const admin = yield prisma.authModel.findUnique({ where: { id: adminID } });
        const group = yield prisma.groupModel.findUnique({
            where: { id: groupID },
        });
        if (adminID === (group === null || group === void 0 ? void 0 : group.adminID)) {
            const deleteGroup = yield prisma.groupModel.delete({
                where: { id: groupID },
            });
            return res.status(200).json({
                message: "Deleted Group Successfully",
                data: deleteGroup,
            });
        }
        else {
            return res.status(400).json({
                message: "You ain't authorised to do this",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Deleting Group",
            data: error.message,
        });
    }
});
exports.deleteGroup = deleteGroup;
