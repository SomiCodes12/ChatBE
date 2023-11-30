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
exports.createNotice = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notice } = req.body;
        const noticeCreate = yield prisma.notifyModel.create({
            data: {
                notice
            },
        });
        console.log(noticeCreate);
        return res.status(201).json({
            message: "Created Notice Successfully",
            data: noticeCreate,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error Creating Notice",
            data: error.message,
            error
        });
    }
});
exports.createNotice = createNotice;
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
