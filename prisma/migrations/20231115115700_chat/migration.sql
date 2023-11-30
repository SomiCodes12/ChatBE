/*
  Warnings:

  - You are about to drop the column `groups` on the `authModel` table. All the data in the column will be lost.
  - Added the required column `userID` to the `groupModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authModel" DROP COLUMN "groups";

-- AlterTable
ALTER TABLE "groupModel" ADD COLUMN     "userID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "groupModel" ADD CONSTRAINT "groupModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
