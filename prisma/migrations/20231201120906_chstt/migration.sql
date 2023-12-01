-- CreateTable
CREATE TABLE "authModel" (
    "id" STRING NOT NULL,
    "userName" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "image" STRING NOT NULL,
    "imageID" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profileModel" (
    "id" STRING NOT NULL,
    "userName" STRING,
    "location" STRING,
    "dateOfBirth" STRING,
    "image" STRING,
    "coverPhoto" STRING,
    "userID" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profileModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatModel" (
    "id" STRING NOT NULL,
    "members" JSONB NOT NULL,
    "userID" STRING NOT NULL,
    "friendID" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messageModel" (
    "id" STRING NOT NULL,
    "chatID" STRING NOT NULL,
    "userID" STRING NOT NULL,
    "message" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messageModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupModel" (
    "id" STRING NOT NULL,
    "members" JSONB NOT NULL,
    "adminID" STRING NOT NULL,
    "userID" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupMessageModel" (
    "id" STRING NOT NULL,
    "groupID" STRING NOT NULL,
    "userID" STRING NOT NULL,
    "message" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupMessageModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifyModel" (
    "id" STRING NOT NULL,
    "notice" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifyModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authModel_email_key" ON "authModel"("email");

-- AddForeignKey
ALTER TABLE "profileModel" ADD CONSTRAINT "profileModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatModel" ADD CONSTRAINT "chatModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messageModel" ADD CONSTRAINT "messageModel_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "chatModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupModel" ADD CONSTRAINT "groupModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMessageModel" ADD CONSTRAINT "groupMessageModel_groupID_fkey" FOREIGN KEY ("groupID") REFERENCES "groupModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
