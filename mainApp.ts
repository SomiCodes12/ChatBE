import cors from "cors"
import express, { Application, Request, Response } from "express"
import auth from "./Router/authRouter"
import chat from "./Router/chatRouter"
import message from "./Router/messageRouter"
import group from "./Router/groupRouter"
import groupMessage from "./Router/groupMessageRouter"
import notice from "./Router/noticeRouter"
import profile from "./Router/profileRouter"

export const mainApp = ( app : Application) => {
    app.use(express.json())
    app.use(cors())

    app.get("/" , ( req : Request , res : Response) => {
        try {
            
            return res.status(200).json({
                message : "Welcome to Our Chat App 😊😊"
            })
        } catch (error : any) {
            return res.status(400).json({
                message : `API Error${error.message}`,
                reason: error
            })
        }
    })

    app.use("/api/v1" , auth)
    app.use("/api/v1" , chat)
    app.use("/api/v1" , message)
    app.use("/api/v1" , group)
    app.use("/api/v1" , groupMessage)
    app.use("/api/v1" , profile)
    app.use("/api/v1" , notice)
}