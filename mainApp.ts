import cors from "cors"
import express, { Application } from "express"
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

    app.use("/api/v1" , auth)
    app.use("/api/v1" , chat)
    app.use("/api/v1" , message)
    app.use("/api/v1" , group)
    app.use("/api/v1" , groupMessage)
    app.use("/api/v1" , profile)
    app.use("/api/v1" , notice)
}