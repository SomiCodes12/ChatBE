/*
  Warnings:

  - Added the required column `userID` to the `profileModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profileModel" ADD COLUMN     "userID" TEXT NOT NULL,
ALTER COLUMN "userName" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "coverPhoto" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "profileModel" ADD CONSTRAINT "profileModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
