-- CreateTable
CREATE TABLE "authModel" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "requests" JSONB NOT NULL,
    "friends" JSONB NOT NULL,
    "groups" JSONB NOT NULL,
    "following" JSONB NOT NULL,
    "followers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profileModel" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profileModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatModel" (
    "id" TEXT NOT NULL,
    "members" JSONB NOT NULL,
    "userID" TEXT NOT NULL,
    "friendID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messageModel" (
    "id" TEXT NOT NULL,
    "chatID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messageModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupModel" (
    "id" TEXT NOT NULL,
    "members" JSONB NOT NULL,
    "adminID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupMessageModel" (
    "id" TEXT NOT NULL,
    "groupID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupMessageModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authModel_email_key" ON "authModel"("email");

-- AddForeignKey
ALTER TABLE "chatModel" ADD CONSTRAINT "chatModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messageModel" ADD CONSTRAINT "messageModel_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "chatModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMessageModel" ADD CONSTRAINT "groupMessageModel_groupID_fkey" FOREIGN KEY ("groupID") REFERENCES "groupModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
